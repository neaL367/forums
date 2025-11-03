"use client";

import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Globe,
  Calendar,
  Activity,
  MessageSquare,
  Trophy,
  FileText,
  User,
} from "lucide-react";

import Link from "next/link";
import { Edit } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MemberProfile } from "@/types/member";
import type { Route } from "next";

interface ProfileProps {
  member: MemberProfile;
  isOwnProfile: boolean;
}

export function Profile({ member, isOwnProfile }: ProfileProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            Profile
          </h1>
          <p className="text-muted-foreground text-sm">View profile information</p>
        </div>
        {isOwnProfile && (
          <Link href={`/profile/${member.id}/edit` as Route}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="bg-card border border-border shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 rounded-full ring-4 ring-border ring-offset-2 ring-offset-background transition-all duration-300 group-hover:ring-foreground/20">
                {member.image ? (
                  <AvatarImage
                    src={member.image}
                    alt={`${member.displayUsername}'s avatar`}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="h-full w-full bg-muted text-foreground text-4xl font-bold rounded-full flex items-center justify-center border-2 border-border">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                )}
              </Avatar>
            
            </div>
            <div className="flex-1 text-center sm:text-start space-y-3">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {member.displayUsername}
                </h2>
                <Badge 
                  variant="secondary" 
                  className="text-sm font-medium px-3 py-1"
                >
                  {member.role.charAt(0).toUpperCase() +
                    member.role.slice(1).toLowerCase()}
                </Badge>
              </div>
              {member.bio && (
                <p className="text-muted-foreground text-sm line-clamp-2 max-w-2xl">
                  {member.bio}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Card */}
      <Card className="bg-card border border-border shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2.5 bg-muted rounded-lg">
              <FileText className="w-5 h-5 text-foreground" />
            </div>
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          {member.bio && member.bio.trim() !== "" ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {member.bio}
              </p>
            </div>
          ) : (
            <div className="text-muted-foreground italic py-4">
              No bio available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card border border-border shadow-md hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-muted rounded-xl w-fit mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-foreground" />
            </div>
            <div className="text-4xl font-bold mb-1 text-foreground">{member.postCount}</div>
            <div className="text-sm text-muted-foreground font-medium">Posts</div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-md hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-muted rounded-xl w-fit mx-auto mb-4">
              <Trophy className="w-6 h-6 text-foreground" />
            </div>
            <div className="text-4xl font-bold mb-1 text-foreground">{member.reputation}</div>
            <div className="text-sm text-muted-foreground font-medium">Reputation</div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-md hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-muted rounded-xl w-fit mx-auto mb-4">
              <Calendar className="w-6 h-6 text-foreground" />
            </div>
            <div className="text-2xl font-bold mb-1 text-foreground">
              {format(new Date(member.joinDate), "MMM yyyy")}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Joined</div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-md hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-muted rounded-xl w-fit mx-auto mb-4">
              <Activity className="w-6 h-6 text-foreground" />
            </div>
            <div className="text-2xl font-bold mb-1 text-foreground">
              {format(new Date(member.lastActive), "MMM dd, yyyy")}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Last Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Location Card */}
        <Card className="bg-card border border-border shadow-md hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-xl shrink-0">
                <MapPin className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1.5">Location</h3>
                <span className="text-muted-foreground block truncate">
                  {member.location || (
                    <span className="italic">Not specified</span>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Website Card */}
        <Card className="bg-card border border-border shadow-md hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-xl shrink-0">
                <Globe className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1.5">Website</h3>
                {member.website ? (
                  <a
                    href={member.website}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 underline break-all block truncate"
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
