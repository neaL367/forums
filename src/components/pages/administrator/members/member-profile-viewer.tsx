"use client";

import { format } from 'date-fns';
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Members } from "@/types/member";
import { FormFields } from "./form-fields";
import { updateMemberAction } from "@/actions/administrator/member";

interface MemberProfileViewerProps {
  item: Members;
  onClose?: () => void;
  isModal?: boolean;
  onUpdate?: (updatedMember: Members) => void;
}

export function MemberProfileViewer({ 
  item, 
  onClose, 
  isModal = false,
  onUpdate
}: MemberProfileViewerProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData(document.querySelector('form') as HTMLFormElement);
      
      const updates = {
        username: formData.get('username') as string,
        displayUsername: formData.get('displayUsername') as string,
        image: formData.get('image') as string,
      };

      const result = await updateMemberAction(updates);
      
      if (result.success) {
        toast.success(result.message);
        
        const updatedMember = {
          ...item,
          ...updates,
          updatedAt: new Date()
        };
        
        onUpdate?.(updatedMember);
        onClose?.();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  function roleBadgeVariant(role: Members["role"]) {
    if (role === "ADMINISTRATOR") return "default";
    if (role === "MODERATOR") return "secondary";
    return "outline";
  }

  function Summary({
    label,
    value,
    monospace,
  }: {
    label: string;
    value: React.ReactNode;
    monospace?: boolean;
  }) {
    return (
      <div className="flex flex-col">
        <span className="font-medium">{label}:</span>
        <div
          className={`mt-1 ${monospace ? "font-mono text-xs text-muted-foreground" : "text-muted-foreground"}`}
        >
          {value}
        </div>
      </div>
    );
  }

  if (isModal) {
    return (
      <Drawer direction={isMobile ? "bottom" : "right"} open={true} onOpenChange={(open) => !open && onClose?.()}>
        <DrawerContent
          className={isMobile ? "h-[60vh] rounded-t-lg" : "max-w-md"}
        >
          <DrawerHeader>
            <DrawerTitle>Edit Member: {item.username}</DrawerTitle>
            <DrawerDescription>
              Edit member account details and permissions
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-6 px-4 pb-4 overflow-y-auto text-sm">
            {/* Account Overview */}
            {!isMobile && (
              <>
                <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <h3 className="text-base font-semibold">Account Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Summary label="ID" value={item.id} monospace />
                    <Summary
                      label="Email Verified"
                      value={
                        <Badge
                          variant={item.emailVerified ? "default" : "secondary"}
                        >
                          {item.emailVerified ? "Yes" : "No"}
                        </Badge>
                      }
                    />
                    <Summary
                      label="Status"
                      value={
                        <Badge variant={item.banned ? "destructive" : "default"}>
                          {item.banned ? "Banned" : "Active"}
                        </Badge>
                      }
                    />
                    <Summary
                      label="Created"
                      value={format(new Date(item.createdAt), "MMM dd, yyyy")}
                    />
                    <Summary
                      label="Updated"
                      value={format(new Date(item.updatedAt), "MMM dd, yyyy")}
                    />
                    {item.banned && (
                      <>
                        <Summary
                          label="Ban Expires"
                          value={
                            item.banExpires
                              ? format(new Date(item.banExpires), "MMM dd, yyyy")
                              : "Permanent"
                          }
                        />
                        {item.banReason && (
                          <Summary label="Ban Reason" value={item.banReason} />
                        )}
                      </>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            <FormFields item={item} />
          </div>
          <DrawerFooter>
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.username}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={isMobile ? "h-[60vh] rounded-t-lg" : "max-w-md"}
      >
        <DrawerHeader>
          <DrawerTitle>Member Profile: {item.username}</DrawerTitle>
          <DrawerDescription>
            View and manage member account details and permissions
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-6 px-4 pb-4 overflow-y-auto text-sm">
          {/* Account Overview */}
          {!isMobile && (
            <>
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <h3 className="text-base font-semibold">Account Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Summary label="ID" value={item.id} monospace />
                  <Summary
                    label="Role"
                    value={
                      <Badge variant={roleBadgeVariant(item.role)}>
                        {item.role}
                      </Badge>
                    }
                  />
                  <Summary
                    label="Email Verified"
                    value={
                      <Badge
                        variant={item.emailVerified ? "default" : "secondary"}
                      >
                        {item.emailVerified ? "Yes" : "No"}
                      </Badge>
                    }
                  />
                  <Summary
                    label="Status"
                    value={
                      <Badge variant={item.banned ? "destructive" : "default"}>
                        {item.banned ? "Banned" : "Active"}
                      </Badge>
                    }
                  />
                  <Summary
                    label="Created"
                    value={format(new Date(item.createdAt), "MMM dd, yyyy")}
                  />
                  <Summary
                    label="Updated"
                    value={format(new Date(item.updatedAt), "MMM dd, yyyy")}
                  />
                  {item.banned && (
                    <>
                      <Summary
                        label="Ban Expires"
                        value={
                          item.banExpires
                            ? format(new Date(item.banExpires), "MMM dd, yyyy")
                            : "Permanent"
                        }
                      />
                      {item.banReason && (
                        <Summary label="Ban Reason" value={item.banReason} />
                      )}
                    </>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          <FormFields item={item} />
        </div>
        <DrawerFooter>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}



