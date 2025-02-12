import { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { ProjectList } from "@/components/project/project-list";

interface WorkspacePageProps {
  params: {
    workspaceId: string;
  };
}

export async function generateMetadata({
  params,
}: WorkspacePageProps): Promise<Metadata> {
  const workspace = await api.workspace.get({ id: params.workspaceId });

  if (!workspace) {
    return {
      title: "ワークスペースが見つかりません | Flowline",
    };
  }

  return {
    title: `${workspace.name} | Flowline`,
    description: workspace.description,
  };
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const workspace = await api.workspace.get({ id: params.workspaceId });

  if (!workspace) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">{workspace.name}</h1>
            <p className="text-muted-foreground">{workspace.description}</p>
          </div>
        </div>
        <ProjectList workspaceId={workspace.id} />
      </div>
    </div>
  );
} 