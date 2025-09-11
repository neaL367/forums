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

export const emailVerification = [
  {
    value: true,
    label: "Verified",
  },
  {
    value: false,
    label: "Not Verified",
  },
];

export const ban = [
  {
    value: true,
    label: "Banned",
  },
  {
    value: false,
    label: "Not Banned",
  },
];

export const filters = [
  {
    columnId: "role",
    title: "Role",
    options: roles,
  },
  {
    columnId: "emailVerified",
    title: "Email Verified",
    options: emailVerification,
  },
  {
    columnId: "banned",
    title: "Ban",
    options: ban,
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
