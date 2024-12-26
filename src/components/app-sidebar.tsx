"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { api } from "@/trpc/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "@/components/ui/sidebar"
import {
  HomeIcon,
  FolderIcon,
  InboxIcon,
  BellIcon,
  CogIcon,
} from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()
  const { data: workspaces } = api.workspace.list.useQuery()

  return (
    <Sidebar>
      <ScrollArea className="h-full">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Link href="/app">
                <Button
                  variant={pathname === "/app" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  ホーム
                </Button>
              </Link>
              <Link href="/app/notifications">
                <Button
                  variant={pathname === "/app/notifications" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <BellIcon className="mr-2 h-4 w-4" />
                  通知
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              ワークスペース
            </h2>
            <div className="space-y-1">
              {workspaces?.map((workspace) => (
                <Link
                  key={workspace.id}
                  href={`/app/workspaces/${workspace.id}`}
                >
                  <Button
                    variant={
                      pathname === `/app/workspaces/${workspace.id}`
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full justify-start"
                  >
                    <FolderIcon className="mr-2 h-4 w-4" />
                    {workspace.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </Sidebar>
  )
}
