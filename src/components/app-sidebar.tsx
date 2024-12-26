"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Define the type for a navigation item
interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  items?: { title: string; url: string }[];
}

// Define the type for the data structure
interface SidebarData {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: NavItem[];
  navSecondary: NavItem[];
  projects: { name: string; url: string; icon: React.ComponentType<any> }[];
}


const data: SidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "/app",
      icon: SquareTerminal,
      items: [
        {
          title: "History",
          url: "/app/history",
        },
        {
          title: "Starred",
          url: "/app/starred",
        },
        {
          title: "Settings",
          url: "/app/settings",
        },
      ],
    },
    {
      title: "Models",
      url: "/app/models",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "/app/models/genesis",
        },
        {
          title: "Explorer",
          url: "/app/models/explorer",
        },
        {
          title: "Quantum",
          url: "/app/models/quantum",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/app/documentation",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/app/documentation/introduction",
        },
        {
          title: "Get Started",
          url: "/app/documentation/get-started",
        },
        {
          title: "Tutorials",
          url: "/app/documentation/tutorials",
        },
        {
          title: "Changelog",
          url: "/app/documentation/changelog",
        },
      ],
    },
    {
      title: "Settings",
      url: "/app/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/app/settings/general",
        },
        {
          title: "Team",
          url: "/app/settings/team",
        },
        {
          title: "Billing",
          url: "/app/settings/billing",
        },
        {
          title: "Limits",
          url: "/app/settings/limits",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/app/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/app/feedback",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/app/workspaces/1/projects/1",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/app/workspaces/1/projects/2",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/app/workspaces/1/projects/3",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
