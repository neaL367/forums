export const roles = [
  {
    value: "MEMBERS",
    label: "Members",
  },
  {
    value: "ADMINISTRATOR",
    label: "Administrator",
  },
  {
    value: "MODERATOR",
    label: "Moderator",
  },
  {
    value: "OWNER",
    label: "Owner",
  },
  {
    value: "STAFF",
    label: "Staff",
  },
  {
    value: "GUEST",
    label: "Guest",
  },
];

export const actions = [
  {
    label: "View Profile",
  },
  {
    label: "Edit Member",
  },
  {
    label: "Set Role",
    subMenu: {
      label: "Set Role",
      options: roles,
    },
  },
  {
    label: "Set Password",
  },
  {
    label: "Impersonate",
  },
  {
    label: "Manage Sessions",
  },
  {
    label: "Revoke All Sessions",
  },
  {
    label: "Ban/Unban Member",
  },
  {
    label: "Remove Member",
  },
];

export const breadcrumbs = [
  { label: "Administrator", href: "/administrator" },
  { label: "Members" },
];