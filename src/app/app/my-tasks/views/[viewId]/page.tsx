import { ViewContent } from "@/components/view/view-contents";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

interface Props {
  params: {
    viewId: string;
  };
}

export default async function MyTasksViewPage({ params }: Props) {
  const view = await api.myTasksViews.getById.query({
    id: params.viewId,
  });

  if (!view) {
    notFound();
  }

  const tasks = await api.task..query({
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
