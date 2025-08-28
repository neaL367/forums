import AccountSettingsSidebar from "@/components/pages/account-settings/sidebar-navigation";

export default function AccountSettingsLayout(props: LayoutProps<'/account-settings'>) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Account Settings
        </h1>
        <p className="text-zinc-300">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <AccountSettingsSidebar />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          {props.username}
          {props.children}
          {props.email}
          {props.password}
        </div>
      </div>
    </div>
  );
}
