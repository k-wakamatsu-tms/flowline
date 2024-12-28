import { ViewSwitcher } from "@/components/project/view-switcher";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: {
    workspaceId: string;
    projectId: string;
  };
}

export default async function ProjectViewLayout({ children, params }: Props) {
  const project = await api.projects.getById.query({
    id: params.projectId,
  });

  if (!project) {
    notFound();
  }

  const views = await api.projectViews.getAll.query({
    projectId: params.projectId,
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <ViewSwitcher projectId={params.projectId} views={views} />
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
