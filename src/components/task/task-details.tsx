import { type Task, type User, type Project, type Section } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, FlagIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface TaskDetailsProps {
  task: Task & {
    assignee: User | null;
    project: Project;
    section: Section;
  };
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const priorityColors = {
    高: "bg-red-100 text-red-800",
    中: "bg-yellow-100 text-yellow-800",
    低: "bg-green-100 text-green-800",
  };

  const statusColors = {
    未着手: "bg-gray-100 text-gray-800",
    進行中: "bg-blue-100 text-blue-800",
    "レビュー待ち": "bg-purple-100 text-purple-800",
    完了: "bg-green-100 text-green-800",
    保留: "bg-orange-100 text-orange-800",
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{task.name}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className={priorityColors[task.priority as keyof typeof priorityColors]}>
              <FlagIcon className="w-4 h-4 mr-1" />
              {task.priority}
            </Badge>
            <Badge variant="secondary" className={statusColors[task.status as keyof typeof statusColors]}>
              {task.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="mr-2">{task.project.name}</span>
          <span className="mx-2">›</span>
          <span>{task.section.name}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {task.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">説明</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">担当者</p>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.image ?? undefined} />
                    <AvatarFallback>{task.assignee.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee.name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">未割り当て</span>
              )}
            </div>
          </div>

          {task.dueDate && (
            <div className="space-y-1">
              <p className="text-sm font-medium">期限</p>
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4" />
                <span>{format(task.dueDate, "yyyy年MM月dd日", { locale: ja })}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 