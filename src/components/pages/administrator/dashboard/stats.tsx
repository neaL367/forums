import { Users, MessageSquare, Folder } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Stats() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 lg:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Members */}
      <Card>
        <CardHeader>
          <CardDescription>Total Members</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            12,345
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <Users className="h-4 w-4" />
              +5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Growing community <Users className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground">
            Active sign-ups in the last month
          </div>
        </CardFooter>
      </Card>

      {/* Forums */}
      <Card>
        <CardHeader>
          <CardDescription>Total Forums</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            42
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <Folder className="h-4 w-4" />
              Stable
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Organized categories <Folder className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground">Forums currently online</div>
        </CardFooter>
      </Card>

      {/* Topics */}
      <Card>
        <CardHeader>
          <CardDescription>Total Topics</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            8,976
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              +12%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Active discussions <MessageSquare className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground">Topics created recently</div>
        </CardFooter>
      </Card>
    </div>
  );
}
