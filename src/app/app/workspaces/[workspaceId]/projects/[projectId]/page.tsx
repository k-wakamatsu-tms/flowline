import { type ViewType } from "@/types/view";
import { ViewLayout } from "@/components/view/view-layout";
import { ViewContent } from "@/components/view/view-contents";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

interface Props {
  params: {
    workspaceId: string;
    projectId: string;
  };
  searchParams: {
    view?: ViewType;
  };
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const project = await api.projects.getById.query({
    id: params.projectId,
  });

  if (!project) {
    redirect("/app");
  }

  const tasks = await api.tasks.getByProjectId.query({
    projectId: params.projectId,
  });

  const defaultView = await api.projectViews.getDefault.query({
    projectId: params.projectId,
  });

  const currentView = searchParams.view ?? defaultView?.type ?? "overview";

  return (
    <ViewLayout
      title={project.name}
      viewType={currentView}
      onViewTypeChange={(type) => {
        // クライアントサイドでの遷移は別途実装
      }}
    >
      <ViewContent
        type={currentView}
        tasks={tasks}
        onTaskUpdate={async () => {
          // タスク更新処理は別途実装
        }}
      />
    </ViewLayout>
  );
}
