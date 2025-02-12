import { ViewContent } from "@/components/view/view-contents";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

interface Props {
  params: {
    workspaceId: string;
    projectId: string;
    viewId: string;
  };
}

export default async function ProjectViewPage({ params }: Props) {
  const view = await api.projectViews.getById.query({
    id: params.viewId,
  });

  if (!view) {
    notFound();
  }

  const tasks = await api.tasks.getByProjectId.query({
    projectId: params.projectId,
    filters: view.filters,
    sort: view.sort,
    groupBy: view.groupBy,
  });

  return (
    <div className="p-6">
      <ViewContent
        type={view.type}
        tasks={tasks}
        onTaskUpdate={async () => {
          // タスク更新処理は別途実装
        }}
      />
    </div>
  );
}
