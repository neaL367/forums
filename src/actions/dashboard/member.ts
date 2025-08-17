"use server"

import { APIError } from "better-auth/api"
import { headers } from "next/headers";
import { auth } from "@/lib/auth"

type ListMembersParams = {
  searchValue?: string;
  searchField?: "email" | "name";
  searchOperator?: "contains" | "starts_with" | "ends_with";
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filterField?: string;
  filterValue?: string | number | boolean;
  filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
};

export async function setMemberRoleAction(memberId: string, role: "ADMINISTRATOR" | "MEMBERS") {
  try {
    await auth.api.setRole({
      body: { userId: memberId, role: role },
      headers: await headers(),
    });

    return {
      success: true,
      message: `Member role set to ${role} successfully.`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof APIError ? error.body?.message || error.message : "An unexpected error occurred.",
    };
  }
}

export async function setMemberPasswordAction(memberId: string, newPassword: string) {
  try {
    await auth.api.setUserPassword({
      body: { userId: memberId, newPassword: newPassword },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Member password updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof APIError ? error.body?.message || error.message : "An unexpected error occurred.",
    };
  }
}

export async function listMembersAction(params: ListMembersParams = {}) {
  try {
    const res = await auth.api.listUsers({
      query: {
        limit: params.limit ?? 10,
        offset: params.offset ?? 0,
        searchValue: params.searchValue,
        searchField: params.searchField,
        searchOperator: params.searchOperator,
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
        filterField: params.filterField,
        filterValue: params.filterValue,
        filterOperator: params.filterOperator,
      },
      headers: await headers(),
    });

    return {
      success: true,
      members: res.users,
      total: res.total,
      limit: ('limit' in res ? res.limit : undefined) ?? params.limit,
      offset: ('offset' in res ? res.offset : undefined) ?? params.offset,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof APIError
          ? error.body?.message || error.message
          : "An unexpected error occurred while fetching members.",
    };
  }
}

export async function removeMemberAction(memberId: string) {
  try {
    await auth.api.removeUser({
      body: { userId: memberId },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Member deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof APIError ? error.body?.message || error.message : "An unexpected error occurred.",
    };
  }
}