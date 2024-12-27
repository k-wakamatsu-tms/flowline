"use client"

import { signOut } from "next-auth/react";
import {
  Building2,
  ChevronsUpDown,
  LogOut,
  Plus,
  Settings,
  User,
  UserPlus,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { CreateWorkspaceDialog } from "../workspace/create-workspace-dialog";
import { useState } from "react";

export function NavUser({
  user,
}: {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? undefined} />
                <AvatarFallback className="rounded-lg">
                  {user.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image ?? undefined} alt={user.name ?? undefined} />
                  <AvatarFallback className="rounded-lg">
                    {user.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/app/admin")}>
                <Building2 className="mr-2 h-4 w-4" />
                管理者コンソール
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                新規ワークスペース
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/app/invites")}>
                <UserPlus className="mr-2 h-4 w-4" />
                招待
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/app/profile")}>
                <User className="mr-2 h-4 w-4" />
                プロフィール
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/app/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                設定
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CreateWorkspaceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </SidebarMenu>
  );
}
