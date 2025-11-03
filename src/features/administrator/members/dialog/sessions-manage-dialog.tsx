"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { format } from "date-fns";
import { Loader2, Monitor, Smartphone, Tablet, Globe } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDialog } from "@/hooks/use-dialog";
import { listUserSessionsAction } from "@/actions/administrator/members/list-sessions";
import { revokeSessionFormAction } from "@/actions/administrator/members/revoke-session";
import type { Member } from "@/types/member";
import type { Session } from "@/lib/auth";
import type {
  RevokeSessionFormData,
  RevokeSessionFormState,
} from "@/formdata/administrator/member/revoke-session";

interface SessionManagementDialogProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionManagementDialog({
  member,
  open,
  onOpenChange,
}: SessionManagementDialogProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const revokeFormRef = useRef<HTMLFormElement>(null);

  const revokeDialog = useDialog<RevokeSessionFormData>({
    action: revokeSessionFormAction,
    initialState: {
      success: false,
      message: "",
    } as RevokeSessionFormState,
    loadingMessage: "Revoking session...",
    onSuccessCallbackAction: () => {
      if (revokingToken) {
        // Remove the session from the list
        setSessions((prev) =>
          prev.filter((s) => s.token !== revokingToken),
        );
        setRevokingToken(null);
      }
    },
  });

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listUserSessionsAction(member.id);
      if (result.success && result.sessions) {
        setSessions(
          result.sessions.map((s) => ({
            ...s,
            id: s.id,
            sessionToken: s.token,
            createdAt: s.createdAt,
            expiresAt: s.expiresAt,
            userAgent: s.userAgent,
            ipAddress: s.ipAddress,
          })),
        );
      }
    } catch {
      // Error handling is done in the action
    } finally {
      setLoading(false);
    }
  }, [member.id]);

  useEffect(() => {
    if (open) {
      loadSessions();
    }
  }, [loadSessions, open]);

  const handleRevokeSession = (sessionToken: string) => {
    setRevokingToken(sessionToken);
    // Update hidden input and submit form
    if (revokeFormRef.current) {
      const tokenInput = revokeFormRef.current.querySelector(
        'input[name="sessionToken"]',
      ) as HTMLInputElement;
      if (tokenInput) {
        tokenInput.value = sessionToken;
      }
      revokeFormRef.current.requestSubmit();
    }
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Globe className="h-4 w-4" />;

    const ua = userAgent.toLowerCase();
    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
      return <Smartphone className="h-4 w-4" />;
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      return <Tablet className="h-4 w-4" />;
    } else {
      return <Monitor className="h-4 w-4" />;
    }
  };

  const getDeviceType = (userAgent?: string) => {
    if (!userAgent) return "Unknown";

    const ua = userAgent.toLowerCase();
    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
      return "Mobile";
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      return "Tablet";
    } else {
      return "Desktop";
    }
  };

  const isSessionExpired = (expires: Date) => {
    return new Date() > new Date(expires);
  };

  return (
    <>
      <form ref={revokeFormRef} action={revokeDialog.formAction}>
        <input type="hidden" name="sessionToken" />
      </form>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Manage Sessions - {member.username}</DialogTitle>
            <DialogDescription>
              View and manage all active sessions for this user.
            </DialogDescription>
          </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading sessions...
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active sessions found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(session.userAgent ?? "Unknown")}
                          <span className="text-sm">
                            {getDeviceType(session.userAgent ?? "Unknown")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {session.ipAddress || "Unknown"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(
                          new Date(session.createdAt),
                          "MMM dd, yyyy HH:mm",
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(
                          new Date(session.expiresAt),
                          "MMM dd, yyyy HH:mm",
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            isSessionExpired(session.expiresAt)
                              ? "secondary"
                              : "default"
                          }
                        >
                          {isSessionExpired(session.expiresAt)
                            ? "Expired"
                            : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeSession(session.token)}
                          disabled={
                            revokingToken === session.token ||
                            revokeDialog.pending ||
                            isSessionExpired(session.expiresAt)
                          }
                        >
                          {revokingToken === session.token &&
                          revokeDialog.pending ? (
                            <>
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              Revoking...
                            </>
                          ) : (
                            "Revoke"
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Total sessions: {sessions.length}
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={loadSessions}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
