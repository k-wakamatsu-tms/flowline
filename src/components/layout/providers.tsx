"use client";
import React from "react";
import { ThemeProvider } from "./ThemeToggle/theme-provider";
import { SessionProvider, type SessionProviderProps } from "next-auth/react";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "../ui/toaster";
export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  return (
    <>
      <TRPCReactProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </TRPCReactProvider>
    </>
  );
}
