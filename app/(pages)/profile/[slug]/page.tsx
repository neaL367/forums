import { headers } from "next/headers"
import { notFound } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { UserIcon, Mail, Shield, Calendar, MessageSquare, Heart, Bell, AlertTriangle } from "lucide-react"

import { auth } from "@/lib/auth"
import { getAllUsers, getUserById } from "@/queries/user"

export async function generateStaticParams() {
  const users = await getAllUsers()
  return users.map((user) => ({
    slug: `${user.id}-${user.username}`,
  }))
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) return notFound()

  const { slug } = await params
  const dashIndex = slug.lastIndexOf("-")
  if (dashIndex === -1) return notFound()

  const id = slug.substring(0, dashIndex)

  const user = await getUserById(id)
  if (!user) return notFound()

  // Determine if the profile belongs to the current user
  const isOwnProfile = session.user.id === id

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header/Banner */}
        <div className="h-32 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>

        {/* Profile Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-6">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
              {user.users.image ? (
                <Image
                  src={user.users.image || "/placeholder.svg"}
                  alt={user.users.username ?? "User avatar"}
                  width={128}
                  height={128}
                  className="object-cover h-full w-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
                  <UserIcon className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.users.name ?? user.users.username}
              </h1>
              <div className="flex items-center text-gray-600 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  Joined {format(new Date(user.users.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
            {isOwnProfile && (
              <div className="mt-4 md:mt-0">
                <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md border border-yellow-300 hover:bg-yellow-200 transition-colors font-medium text-sm">
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Account Information
                </h2>

                <div className="flex items-center">
                  <div className="w-8 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.users.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 text-gray-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {user.users.role ?? "Member"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 text-gray-400">
                    {user.users.emailVerified ? (
                      <div className="h-5 w-5 rounded-full bg-yellow-200 flex items-center justify-center">
                        <span className="text-yellow-800 text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-600 text-xs">!</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    {user.users.emailVerified ? (
                      <span className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full text-sm font-medium">
                        Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                {user.users.banned && (
                  <div className="flex items-start mt-2 p-3 bg-red-50 rounded-md border border-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium">Account Restricted</p>
                      <p className="text-red-600 text-sm">
                        {user.users.banReason ?? "This account has been temporarily restricted."}
                        {user.users.banExpires && ` Until ${format(new Date(user.users.banExpires), "MMMM d, yyyy")}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {user.profile?.bio && (
                <div className="bg-gray-50 rounded-lg p-5">
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">About</h2>
                  <p className="text-gray-700 whitespace-pre-line">{user.profile.bio}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Activity</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <MessageSquare className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{user.postCount ?? 0}</p>
                      <p className="text-sm text-gray-600">Posts</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <Heart className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{user.favoriteCount ?? 0}</p>
                      <p className="text-sm text-gray-600">Favorites</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <Bell className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{user.subscriptionCount ?? 0}</p>
                      <p className="text-sm text-gray-600">Subscriptions</p>
                    </div>
                  </div>
                </div>
              </div>

              {(user.profile?.location || user.profile?.website) && (
                <div className="bg-gray-50 rounded-lg p-5">
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Contact</h2>

                  {user.profile?.location && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{user.profile.location}</p>
                    </div>
                  )}

                  {user.profile?.website && (
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a
                        href={
                          user.profile.website.startsWith("http")
                            ? user.profile.website
                            : `https://${user.profile.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-600 hover:underline font-medium"
                      >
                        {user.profile.website}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
