import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { type Metadata } from "next";
import Providers from "@/components/layout/providers";
import { auth } from "@/server/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Flowline",
  description: "効率的なタスク管理ツール",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
