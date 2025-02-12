"use client";
import * as React from "react";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { api, type RouterOutputs } from "@/trpc/react";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";

type Workspace = NonNullable<RouterOutputs["workspace"]["list"]>[number];

export default function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();
  const { data: workspaces } = api.workspace.list.useQuery();
  const [activeWorkspace, setActiveWorkspace] =
    React.useState<Workspace | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (workspaces?.length && !activeWorkspace) {
      const firstWorkspace = workspaces[0];
      if (firstWorkspace) {
        setActiveWorkspace(firstWorkspace);
      }
    }
  }, [workspaces, activeWorkspace]);

  if (!workspaces) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeWorkspace && (
                  <div className="size-4 font-bold">
                    {activeWorkspace.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace?.name ?? "ワークスペース"}
                </span>
                <span className="truncate text-xs">
                  {activeWorkspace?.description ?? "説明なし"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              ワークスペース
            </DropdownMenuLabel>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => setActiveWorkspace(workspace)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <div className="font-bold">{workspace.name.charAt(0)}</div>
                </div>
                {workspace.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                ワークスペースを作成
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CreateWorkspaceDialog
        trigger={null}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </SidebarMenu>
  );
}
