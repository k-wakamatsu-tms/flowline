import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/components/settings/user-profile";
import { NotificationSettings } from "@/components/settings/notification-settings";

export const metadata: Metadata = {
  title: "設定 | TaskMaster",
  description: "TaskMasterの設定",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">設定</h1>
          <p className="text-muted-foreground">
            アカウントと通知の設定を管理します。
          </p>
        </div>
        <Separator />
        <div className="grid gap-10">
          <UserProfile user={session.user} />
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
} 