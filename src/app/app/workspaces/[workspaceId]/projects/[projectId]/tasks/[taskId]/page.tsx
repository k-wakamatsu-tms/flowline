import { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { TaskDetails } from "@/components/task/task-details";
import { CommentList } from "@/components/task/comment-list";
import { AttachmentList } from "@/components/task/attachment-list";
import { Separator } from "@/components/ui/separator";

interface TaskPageProps {
  params: {
    workspaceId: string;
    projectId: string;
    taskId: string;
  };
}

export async function generateMetadata({ params }: TaskPageProps): Promise<Metadata> {
  const task = await api.task.get({ id: params.taskId });

  if (!task) {
    return {
      title: "タスクが見つかりません",
    };
  }

  return {
    title: `${task.name} - TaskMaster`,
    description: task.description || undefined,
  };
}

export default async function TaskPage({ params }: TaskPageProps) {
  const task = await api.task.get({ id: params.taskId });

  if (!task) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <TaskDetails task={task} />
      
      <Separator className="my-8" />
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">コメント</h2>
        <CommentList taskId={task.id} />
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">添付ファイル</h2>
        <AttachmentList taskId={task.id} />
      </div>
    </div>
  );
} 