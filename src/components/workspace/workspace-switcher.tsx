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
import { Plus } from "lucide-react";

export async function WorkspaceSwitcher() {
  const workspaces = await api.workspace.list();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((workspace) => (
        <Link
          key={workspace.id}
          href={`/app/workspaces/${workspace.id}`}
          className="block"
        >
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle>{workspace.name}</CardTitle>
              <CardDescription>{workspace.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
      <Link href="/app/workspaces/new" className="block">
        <Card className="h-full hover:bg-muted/50 transition-colors">
          <CardContent className="flex h-full items-center justify-center">
            <Button variant="ghost">
              <Plus className="mr-2 h-4 w-4" />
              新しいワークスペース
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
} 