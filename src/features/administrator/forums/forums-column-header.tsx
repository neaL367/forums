import type { Column } from "@tanstack/react-table";
import type { Forum } from "@/types/forum";
import { DataTableColumnHeader } from "@features/administrator/shared/data-table/data-table-column-header";

interface ForumsColumnHeaderProps {
  column: Column<Forum>;
  title: string;
}

export function ForumsColumnHeader({ column, title }: ForumsColumnHeaderProps) {
  return <DataTableColumnHeader column={column} title={title} />;
}
