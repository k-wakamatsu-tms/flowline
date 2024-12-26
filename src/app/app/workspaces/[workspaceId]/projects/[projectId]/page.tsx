import { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { ProjectBoard } from "@/components/project/project-board";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectList } from "@/components/project/project-list";
import Link from "next/link";

interface ProjectPageProps {
  params: {
    workspaceId: string;
    projectId: string;
  };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await api.project.get({
    id: params.projectId,
    workspaceId: params.workspaceId,
  });

  if (!project) {
    return {
      title: "プロジェクトが見つかりません | TaskMaster",
    };
  }

  return {
    title: `${project.name} | TaskMaster`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await api.project.get({
    id: params.projectId,
    workspaceId: params.workspaceId,
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/app/workspaces/${params.workspaceId}/projects/${params.projectId}/board`}
            >
              <Button variant="outline">ボード表示</Button>
            </Link>
            <Link
              href={`/app/workspaces/${params.workspaceId}/projects/${params.projectId}/list`}
            >
              <Button variant="outline">リスト表示</Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="board" className="w-full">
          <TabsList>
            <TabsTrigger value="board">ボード</TabsTrigger>
            <TabsTrigger value="list">リスト</TabsTrigger>
          </TabsList>
          <TabsContent value="board">
            <ProjectBoard projectId={project.id} />
          </TabsContent>
          <TabsContent value="list">
            <ProjectList workspaceId={params.workspaceId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 