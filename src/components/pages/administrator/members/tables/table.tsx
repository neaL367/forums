"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { format } from "date-fns";
import { useId, useMemo, useState } from "react";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Members } from "@/types/member";
import { authClient } from "@/lib/auth-client";

import { MembersTableHeader } from "@/components/pages/administrator/members/tables/table-header";
import { MembersTablePagination } from "@/components/pages/administrator/members/tables/table-pagination";
import { MemberActionsDropdown } from "@/components/pages/administrator/members/member-actions-dropdown";
import { MemberProfileViewer } from "@/components/pages/administrator/members/member-profile-viewer";

import { SetRoleDialog } from "@/components/pages/administrator/members/dialogs/set-role-dialog";
import { SetPasswordDialog } from "@/components/pages/administrator/members/dialogs/set-password-dialog";
import { SessionsDialog } from "@/components/pages/administrator/members/dialogs/sessions-dialog";

export function MembersTable({ data: initialData }: { data: Members[] }) {
  const { data: sessionData } = authClient.useSession();
  const session = sessionData ? {
    id: sessionData.session.id,
    userId: sessionData.user.id,
    token: sessionData.session.token,
    createdAt: sessionData.session.createdAt ? new Date(sessionData.session.createdAt).toISOString() : new Date().toISOString(),
    expiresAt: sessionData.session.expiresAt ? new Date(sessionData.session.expiresAt).toISOString() : new Date().toISOString(),
  } : null;
  const [data, setData] = useState(initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [editingMember, setEditingMember] = useState<Members | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState<Members | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState<Members | null>(null);
  const [showSessionsDialog, setShowSessionsDialog] = useState<Members | null>(null);
  
  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const columns: ColumnDef<Members>[] = [
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return <div>{format(new Date(date), "MMM dd, yyyy")}</div>;
      },
    },
    {
      accessorKey: "updatedAt", 
      header: "Updated At",
      cell: ({ row }) => {
        const date = row.original.updatedAt;
        return <div>{format(new Date(date), "MMM dd, yyyy")}</div>;
      },
    },
    {
      accessorKey: "id",
      header: "ID", 
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        return (
          <MemberProfileViewer 
            item={row.original} 
            onUpdate={(updatedMember) => {
              setData(prev => prev.map(m => 
                m.id === updatedMember.id ? { ...m, ...updatedMember } : m
              ));
            }}
          />
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        const variant =
          role === "ADMINISTRATOR"
            ? "default"
            : role === "MODERATOR"
              ? "secondary"
              : "outline";
        return <Badge variant={variant}>{role}</Badge>;
      },
    },
    {
      accessorKey: "emailVerified",
      header: "Email Verified",
      cell: ({ row }) => {
        const isVerified = row.original.emailVerified;
        return (
          <Badge variant={isVerified ? "default" : "secondary"}>
            {isVerified ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "banned",
      header: "Ban",
      cell: ({ row }) => {
        const isBanned = row.original.banned;
        return (
          <Badge variant={isBanned ? "destructive" : "default"}>
            {isBanned ? "Banned" : "Not Banned"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "banExpires",
      header: "Ban Expires",
      cell: ({ row }) => {
        const banExpires = row.original.banExpires;
        return <div>{banExpires ? format(new Date(banExpires), "MMM dd, yyyy") : "N/A"}</div>;
      },
    },
    {
      id: "actions",
      accessorKey: "id",
      header: "Actions",
      cell: ({ row }) => (
        session ? (
          <MemberActionsDropdown 
            member={row.original}
            session={session}
            onEdit={() => setEditingMember(row.original)}
            onSetRole={() => setShowRoleDialog(row.original)}
            onSetPassword={() => setShowPasswordDialog(row.original)}
            onManageSessions={() => setShowSessionsDialog(row.original)}
            onDataUpdate={setData}
          />
        ) : null
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <MembersTableHeader table={table} />
      
      <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        
        <MembersTablePagination table={table} />
      </TabsContent>

      {/* Dialogs */}
      {editingMember && (
        <MemberProfileViewer 
          item={editingMember} 
          onClose={() => setEditingMember(null)}
          isModal={true}
          onUpdate={(updatedMember) => {
            setData(prev => prev.map(m => 
              m.id === updatedMember.id ? { ...m, ...updatedMember } : m
            ));
            setEditingMember(null);
          }}
        />
      )}

      {showRoleDialog && (
        <SetRoleDialog 
          member={showRoleDialog}
          onClose={() => setShowRoleDialog(null)}
          onSuccess={(updatedMember) => {
            setData(prev => prev.map(m => 
              m.id === updatedMember.id ? { ...m, role: updatedMember.role } : m
            ));
            setShowRoleDialog(null);
          }}
        />
      )}

      {showPasswordDialog && (
        <SetPasswordDialog 
          member={showPasswordDialog}
          onClose={() => setShowPasswordDialog(null)}
        />
      )}

      {showSessionsDialog && (
        <SessionsDialog 
          member={showSessionsDialog}
          onClose={() => setShowSessionsDialog(null)}
        />
      )}
    </Tabs>
  );
}
