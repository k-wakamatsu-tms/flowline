import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>通知設定</CardTitle>
        <CardDescription>
          通知の受信設定を管理します。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="task-assigned">タスクのアサイン</Label>
          <Switch id="task-assigned" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="task-due">タスクの期限</Label>
          <Switch id="task-due" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="task-comment">タスクへのコメント</Label>
          <Switch id="task-comment" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="project-update">プロジェクトの更新</Label>
          <Switch id="project-update" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="workspace-invite">ワークスペースへの招待</Label>
          <Switch id="workspace-invite" />
        </div>
      </CardContent>
    </Card>
  );
} 