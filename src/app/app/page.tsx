import { Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { WorkspaceList } from "@/components/workspace/workspace-list";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { auth } from "@/server/auth";

export const metadata: Metadata = {
  title: "ワークスペース - Flowline",
  description: "ワークスペース一覧",
};

export default async function WorkspacesPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const workspaces = await api.workspace.list();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ワークスペース</h1>
        <CreateWorkspaceDialog />
      </div>

      <WorkspaceList workspaces={workspaces} />
    </div>
  );
} 