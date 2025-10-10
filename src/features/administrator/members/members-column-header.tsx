import { DataTableColumnHeader } from "@features/administrator/shared/data-table/data-table-column-header";
import type { Member } from "@/types/member";
import type { Column } from "@tanstack/react-table";

type MembersColumnHeaderProps = {
  column: Column<Member>;
  title: string;
}

export function MembersColumnHeader({ column, title }: MembersColumnHeaderProps) {
  return <DataTableColumnHeader column={column} title={title} />;
}
