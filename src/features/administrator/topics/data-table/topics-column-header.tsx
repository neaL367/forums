import { DataTableColumnHeader } from "@features/administrator/shared/data-table/data-table-column-header";
import type { Column } from "@tanstack/react-table";
import type { Topic } from "@/types/topic";

interface TopicsColumnHeaderProps {
  column: Column<Topic>;
  title: string;
}

export function TopicsColumnHeader({ column, title }: TopicsColumnHeaderProps) {
  return <DataTableColumnHeader column={column} title={title} />;
}
