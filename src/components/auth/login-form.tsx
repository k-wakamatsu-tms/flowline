"use client"

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export function LoginForm() {
  return (
    <div className="grid gap-6">
      <Button
        variant="outline"
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/app" })}
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Googleでログイン
      </Button>
    </div>
  );
} 