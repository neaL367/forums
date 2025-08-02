import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserProfileById } from "@/dal/user";
import type { UserProfile } from "@/types/user";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return { title: "Profile Not Found" };

  const user: Pick<UserProfile, "displayUsername"> = await getUserProfileById(id);
  if (!user) return { title: "Profile Not Found" };

  return {
    title: `${user.displayUsername}'s Profile`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const user = await getUserProfileById(id);
  if (!user) return notFound();

  return (
    <Card className="max-w-4xl mx-auto ">
      <CardHeader className="border-b border-zinc-800 pb-6">
        <CardTitle className="text-2xl font-bold text-white">
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {/* Header Section with Avatar and Main Info */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-8 border-b border-zinc-800">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user.image || ""}
              alt={`${user.displayUsername}'s avatar`}
              className="rounded-full"
            />
            <AvatarFallback className="h-24 w-24 bg-zinc-800 text-white text-2xl font-bold rounded-full flex items-center justify-center">
              {user.displayUsername.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {user.displayUsername}
              </h2>
              <Badge>
                {user.role.charAt(0).toUpperCase() +
                  user.role.slice(1).toLowerCase()}
              </Badge>
            </div>
            {user.bio && (
              <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-800/50 rounded-lg p-4 text-center border border-zinc-700">
            <div className="text-2xl font-bold text-white mb-1">
              {user.postCount}
            </div>
            <div className="text-zinc-400 text-sm font-medium">Posts</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4 text-center border border-zinc-700">
            <div className="text-2xl font-bold text-white mb-1">
              {user.reputation}
            </div>
            <div className="text-zinc-400 text-sm font-medium">Reputation</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4 text-center border border-zinc-700">
            <div className="text-2xl font-bold text-white mb-1">
              {format(new Date(user.joinDate), "MMM dd, yyyy")}
            </div>
            <div className="text-zinc-400 text-sm font-medium">Joined</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4 text-center border border-zinc-700">
            <div className="text-2xl font-bold text-white mb-1">
              {format(new Date(user.lastActive), "MMM dd, yyyy")}
            </div>
            <div className="text-zinc-400 text-sm font-medium">Last Active</div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                Location
              </label>
              <p className="text-white text-lg">
                {user.location || (
                  <span className="text-zinc-500 italic">Not specified</span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                Website
              </label>
              {user.website ? (
                <a
                  href={user.website}
                  className="text-white hover:text-zinc-300 transition-colors duration-200 text-lg underline decoration-zinc-600 hover:decoration-zinc-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website}
                </a>
              ) : (
                <p className="text-zinc-500 italic text-lg">Not specified</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
