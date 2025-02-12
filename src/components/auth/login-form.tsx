"use client"

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function LoginForm() {
  return (
    <div className="grid gap-6">
      <Button
        variant="outline"
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/app" })}
        className="w-full bg-white text-black hover:bg-gray-50 border border-gray-300 h-10 py-2 px-4"
      >
        <Icons.google className="mr-3 h-5 w-5" />
        Google でログイン
      </Button>
    </div>
  );
} 