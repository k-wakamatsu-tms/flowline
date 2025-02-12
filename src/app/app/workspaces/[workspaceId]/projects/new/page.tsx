import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { CreateProjectDialog } from "@/components/project/create-project-dialog";
import React from "react";

export const metadata: Metadata = {
  title: "新しいプロジェクト | Flowline",
  description: "新しいプロジェクトを作成します。",
};

interface NewProjectPageProps {
  params: {
    workspaceId: string;
  };
}

export default async function NewProjectPage({
  params: { workspaceId },
}: NewProjectPageProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const workspace = await api.workspace.get({ id: workspaceId });
  if (!workspace) {
    redirect("/app");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">新しいプロジェクト</h1>
          <p className="text-muted-foreground">
            {workspace.name}に新しいプロジェクトを作成します。
          </p>
        </div>
        <CreateProjectDialog workspaceId={workspaceId} />
      </div>
    </div>
  );
} 