import { redirect } from "next/navigation";

// import { Paths } from "~/config/site";

import { Navbar } from "./_components/navbar";
import { auth } from "@/server/auth";

export default async function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (session?.user) {
    redirect("/app");
  }

  return (
    <div>
      <Navbar />
      <main className="container pt-28">{children}</main>
    </div>
  );
}
