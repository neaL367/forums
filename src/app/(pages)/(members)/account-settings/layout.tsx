import AccountSettingsSidebar from "@/features/account-settings/shared/sidebar-navigation";
import { getServerSession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function AccountSettingsLayout(
  props: LayoutProps<"/account-settings">
) {
  const session = await getServerSession();
  if (!session) redirect("/auth/sign-in");
  if (!session?.user) return null;

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-zinc-300">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1">
          <AccountSettingsSidebar />
        </div>

        <div className="lg:col-span-4 space-y-6">{props.children}</div>
      </div>
    </div>
  );
}
