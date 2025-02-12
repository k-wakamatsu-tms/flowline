import { api } from "@/trpc/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectBoardProps {
  projectId: string;
}

export async function ProjectBoard({ projectId }: ProjectBoardProps) {
  const sections = await api.section.list({ projectId });
  const tasks = await api.task.list({ projectId });

  const tasksBySection = sections.map((section) => ({
    ...section,
    tasks: tasks.filter((task) => task.sectionId === section.id),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tasksBySection.map((section) => (
        <div key={section.id} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{section.name}</h3>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {section.tasks.map((task) => (
              <Card key={task.id} className="hover:bg-muted/50 transition-colors">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">{task.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      期日:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("ja-JP")
                        : "未設定"}
                    </span>
                    <span>優先度: {task.priority}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 