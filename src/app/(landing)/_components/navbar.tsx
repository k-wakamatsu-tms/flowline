import Link from "next/link";

// import { Paths, SiteConfig } from "~/config/site";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  return (
    <nav className="fixed inset-x-0 flex h-20">
      <div className="container flex w-full items-center justify-between gap-4">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight lg:text-2xl">
          Flowline
        </h1>
        <div className="space-x-4">
          <Button size="sm" variant="ghost" asChild>
            <Link href={"/login"}>ログイン</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={"/signup"}>無料登録</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
