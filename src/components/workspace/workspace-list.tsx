"use client";

import * as React from "react";
import Link from "next/link";
import { type Workspace, type WorkspaceMember } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface WorkspaceListProps {
  workspaces: (Workspace & {
    members: (WorkspaceMember & {
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
    })[];
    _count: {
      projects: number;
    };
  })[];
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((workspace) => (
        <Link
          key={workspace.id}
          href={`/app/workspaces/${workspace.id}`}
          className="transition-transform hover:scale-105"
        >
          <Card>
            <CardHeader>
              <CardTitle>{workspace.name}</CardTitle>
              <CardDescription>
                作成日: {format(workspace.createdAt, "yyyy年MM月dd日", { locale: ja })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">プロジェクト数</p>
                  <p className="text-2xl font-bold">{workspace._count.projects}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">メンバー</p>
                  <div className="flex -space-x-2">
                    {workspace.members.map((member) => (
                      <Avatar key={member.userId} className="border-2 border-background">
                        <AvatarImage src={member.user.image ?? undefined} />
                        <AvatarFallback>{member.user.name?.[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 