"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type OnChangeFn,
  type Row,
  type SortingState,
  type TableOptions,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTablePagination } from "@features/administrator/shared/data-table/data-table-pagination"

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  toolbar?: React.ComponentType<{ table: ReturnType<typeof useReactTable<TData>> }>
  enableExpanding?: boolean
  getSubRows?: (row: TData) => TData[] | undefined
  onExpandedChange?: OnChangeFn<ExpandedState>
  expandedState?: ExpandedState
  searchColumnId?: string
  tableOptions?: Partial<TableOptions<TData>>
}

export function DataTable<TData>({
  columns,
  data,
  toolbar: Toolbar,
  enableExpanding = false,
  getSubRows,
  onExpandedChange,
  expandedState: controlledExpanded,
  searchColumnId,
  tableOptions,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({})

  const expanded = controlledExpanded ?? internalExpanded
  const isControlled = controlledExpanded !== undefined

  const handleExpandedChange: OnChangeFn<ExpandedState> = useCallback(
    (updaterOrValue) => {
      if (onExpandedChange) {
        onExpandedChange(updaterOrValue)
      }
      if (!isControlled) {
        setInternalExpanded(updaterOrValue)
      }
    },
    [onExpandedChange, isControlled],
  )

  const tableState = useMemo(
    () => ({
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(enableExpanding && { expanded }),
    }),
    [sorting, columnVisibility, rowSelection, columnFilters, enableExpanding, expanded],
  )

  const expandingOptions = useMemo(
    () =>
      enableExpanding
        ? {
            onExpandedChange: handleExpandedChange,
            getSubRows,
            getExpandedRowModel: getExpandedRowModel(),
          }
        : {},
    [enableExpanding, handleExpandedChange, getSubRows],
  )

  const table = useReactTable({
    data,
    columns,
    state: tableState,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    ...expandingOptions,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...tableOptions,
  })

  const prevSearchRef = useRef<string>("")

  useEffect(() => {
    if (!enableExpanding || !searchColumnId || !getSubRows) return

    const searchValue = (columnFilters.find((f) => f.id === searchColumnId)?.value as string) || ""
    
    if (searchValue === prevSearchRef.current) return
    prevSearchRef.current = searchValue

    if (searchValue.length > 0) {
      const newExpanded: Record<string, boolean> = {}
      const searchLower = searchValue.toLowerCase()

      // Cache to avoid re-checking the same items
      const matchCache = new Map<TData, boolean>()

      const hasMatchingDescendant = (item: TData): boolean => {
        if (matchCache.has(item)) return matchCache.get(item)!

        const subRows = getSubRows(item)
        if (!subRows || subRows.length === 0) {
          matchCache.set(item, false)
          return false
        }

        const hasMatch = subRows.some((sub) => {
          const matchesSearch = Object.values(sub as object).some((value) =>
            String(value).toLowerCase().includes(searchLower),
          )
          return matchesSearch || hasMatchingDescendant(sub)
        })

        matchCache.set(item, hasMatch)
        return hasMatch
      }

      const expandRow = (row: Row<TData>) => {
        if (hasMatchingDescendant(row.original)) {
          newExpanded[row.id] = true
          row.subRows?.forEach(expandRow)
        }
      }

      table.getRowModel().rows.forEach(expandRow)
      handleExpandedChange(newExpanded)
    } else {
      handleExpandedChange({})
    }
  }, [columnFilters, enableExpanding, searchColumnId, getSubRows, handleExpandedChange, table])

  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows

  return (
    <div className="space-y-4">
      {Toolbar && <Toolbar table={table} />}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} className="px-6">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.id === "expander" ? "pl-6" : "px-6"}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}