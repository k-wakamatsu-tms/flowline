import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export const metadata: Metadata = {
  title: "通知 | TaskMaster",
  description: "TaskMasterの通知",
};

export default async function NotificationsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const notifications = (await api.notification.list({})).items;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">通知</h1>
            <p className="text-muted-foreground">
              最近の通知を確認します。
            </p>
          </div>
          <Button variant="outline">すべて既読にする</Button>
        </div>
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? "bg-muted" : undefined}
            >
              <CardHeader>
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <CardDescription>
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{notification.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 