import { api } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { CreateProjectDialog } from "@/components/project/create-project-dialog";

interface ProjectListProps {
  workspaceId: string;
}

export async function ProjectList({ workspaceId }: ProjectListProps) {
  const projects = await api.project.list({ workspaceId });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/app/workspaces/${workspaceId}/projects/${project.id}`}
          className="block"
        >
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                期日: {project.dueDate ? new Date(project.dueDate).toLocaleDateString("ja-JP") : "未設定"}
              </div>
              <div className="text-sm text-muted-foreground">
                ステータス: {project.status}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      <Card className="h-full hover:bg-muted/50 transition-colors">
        <CardContent className="flex h-full items-center justify-center">
          <CreateProjectDialog workspaceId={workspaceId} />
        </CardContent>
      </Card>
    </div>
  );
} 