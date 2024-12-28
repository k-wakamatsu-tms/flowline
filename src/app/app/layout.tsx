import { AppSidebar } from "@/components/layout/app-sidebar";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <WorkspaceSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
