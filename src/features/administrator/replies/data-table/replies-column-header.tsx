import { DataTableColumnHeader } from "@features/administrator/shared/data-table/data-table-column-header";
import type { Column } from "@tanstack/react-table";
import type { Reply } from "@/types/reply";

interface RepliesColumnHeaderProps {
  column: Column<Reply>;
  title: string;
}

export function RepliesColumnHeader({ column, title }: RepliesColumnHeaderProps) {
  return <DataTableColumnHeader column={column} title={title} />;
}
