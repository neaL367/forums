import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  MapPin,
  Globe,
  Calendar,
  Activity,
  MessageSquare,
  Trophy,
  FileText,
} from "lucide-react";

import { EditProfileModal } from "@/features/profile/edit-profile-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MemberProfile } from "@/types/members";

interface ProfileProps {
  member: MemberProfile;
  isOwnProfile: boolean;
}

export function Profile({ member, isOwnProfile }: ProfileProps) {
  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-zinc-300">View profile information</p>
        </div>
        {isOwnProfile && <EditProfileModal member={member} />}
      </div>

      {/* Basic Info Card */}
      <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row text-center sm:text-start items-center gap-4">
            <Avatar className="h-20 w-20 rounded-full">
              <AvatarImage
                src={member.image || ""}
                alt={`${member.displayUsername}'s avatar`}
                className="h-full w-full object-cover rounded-full"
              />
              <AvatarFallback className="h-full w-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-2xl font-bold rounded-full flex items-center justify-center">
                {member.displayUsername.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-2xl mb-2">
                {member.displayUsername}
              </h3>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <Badge variant="secondary" className="text-sm">
                  {member.role.charAt(0).toUpperCase() +
                    member.role.slice(1).toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            Bio
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {member.bio && member.bio.trim() !== "" ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {member.bio}
              </p>
            </div>
          ) : (
            <div className="text-muted-foreground italic">Not specified</div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg w-fit mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{member.postCount}</div>
            <div className="text-muted-foreground">Posts</div>
          </CardContent>
        </Card>

        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg w-fit mx-auto mb-3">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{member.reputation}</div>
            <div className="text-muted-foreground">Reputation</div>
          </CardContent>
        </Card>

        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg w-fit mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xl font-bold mb-2">
              {format(new Date(member.joinDate), "MMM yyyy")}
            </div>
            <div className="text-muted-foreground">Joined</div>
          </CardContent>
        </Card>

        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg w-fit mx-auto mb-3">
              <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-xl font-bold mb-2">
              {format(new Date(member.lastActive), "MMM dd")}
            </div>
            <div className="text-muted-foreground">Last Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Card */}
        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-1">Location</h3>
                <span className="text-muted-foreground">
                  {member.location || (
                    <span className="italic">Not specified</span>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Website Card */}
        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-1">Website</h3>
                {member.website ? (
                  <a
                    href={member.website}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {member.website}
                  </a>
                ) : (
                  <span className="text-muted-foreground italic">
                    Not specified
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
