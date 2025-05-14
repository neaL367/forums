import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { UserIcon } from "lucide-react";

import { getAllUsers, getUserById } from "@/db/get-user";
import type { User } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function generateStaticParams() {
  const users: User[] = await getAllUsers();
  return users.map((u) => ({ slug: `${u.id}-${u.username}` }));
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return notFound();
  
  const { slug } = await params;
  const [id] = slug.split("-");
  if (!id) return notFound();

  const user = await getUserById(id);
  if (!user) return notFound();

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      {/* Avatar & Name */}
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.username ?? "User avatar"}
              width={80}
              height={80}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-500">
              <UserIcon className="h-8 w-8" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {user.displayUsername ?? user.username}
          </h1>
          <p className="text-sm text-gray-600">
            Joined {format(new Date(user.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      {/* Contact & Status */}
      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {user.emailVerified ? (
            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded">
              Verified
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
              Unverified
            </span>
          )}
        </p>
        {user.banned && (
          <p className="text-red-600">
            Banned{user.banReason ? `: ${user.banReason}` : ""}
            {user.banExpires &&
              ` until ${format(new Date(user.banExpires), "MMMM d, yyyy")}`}
          </p>
        )}
      </div>

      {/* Bio or About (if available) */}
      {user.UserProfile?.[0]?.bio && (
        <section>
          <h2 className="text-xl font-semibold">About</h2>
          <p className="text-gray-700">{user.UserProfile[0].bio}</p>
        </section>
      )}

      {/* Statistics Overview */}
      <section className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xl font-bold">{user.posts?.length ?? 0}</p>
          <p className="text-gray-600">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{user.favorites?.length ?? 0}</p>
          <p className="text-gray-600">Favorites</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{user.subscriptions?.length ?? 0}</p>
          <p className="text-gray-600">Subscriptions</p>
        </div>
      </section>
    </div>
  );
}
