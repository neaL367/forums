"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Members } from "@/types/member";
import {
  listUserSessionsAction,
  revokeMemberSessionAction,
} from "@/actions/administrator/revoke";
import { toast } from "sonner";
import { UserSession } from "@/types/sessions";

interface SessionsDialogProps {
  member: Members;
  onClose: () => void;
}

export function SessionsDialog({ member, onClose }: SessionsDialogProps) {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const result = await listUserSessionsAction(member.id);
        if (result.success) {
          setSessions(
            (result.sessions || []).map((session) => ({
              ...session,
              createdAt: session.createdAt.toISOString(),
              expiresAt: session.expiresAt.toISOString(),
              userAgent: session.userAgent || undefined,
            }))
          );
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to load sessions");
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [member.id]);

  const handleRevokeSession = async (sessionToken: string) => {
    try {
      const result = await revokeMemberSessionAction(sessionToken);
      if (result.success) {
        toast.success(result.message);
        setSessions((prev) => prev.filter((s) => s.token !== sessionToken));
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to revoke session");
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sessions for {member.username}</DialogTitle>
          <DialogDescription>
            Manage active sessions for this member
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div>Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div>No active sessions found</div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      Session ID: {session.id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(session.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expires: {new Date(session.expiresAt).toLocaleString()}
                    </div>
                    {session.userAgent && (
                      <div className="text-xs text-muted-foreground">
                        User Agent: {session.userAgent}
                      </div>
                    )}
                    {session.userId === member.id ? (
                      <div className="text-xs text-muted-foreground">
                        This is the current session
                      </div>
                    ) : null}
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRevokeSession(session.token)}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
