import { type ViewType } from "@/types/view";
import { ViewLayout } from "@/components/view/view-layout";
import { ViewContent } from "@/components/view/view-contents";
import { api } from "@/trpc/server";

interface Props {
  searchParams: {
    view?: ViewType;
  };
}

export default async function MyTasksPage({ searchParams }: Props) {
  const tasks = await api.tasks.getMyTasks.query();
  const settings = await api.myTasks.getSettings.query();

  const currentView = searchParams.view ?? settings?.viewType ?? "list";

  return (
    <ViewLayout
      title="マイタスク"
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
