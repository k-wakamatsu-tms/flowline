"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { type ProjectView } from "~/types/view";

interface ViewSwitcherProps {
  projectId: string;
  views: ProjectView[];
}

export function ViewSwitcher({ projectId, views }: ViewSwitcherProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={(viewId) => {
          router.push(`/app/projects/${projectId}/views/${viewId}`);
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="ビューを選択" />
        </SelectTrigger>
        <SelectContent>
          {views.map((view) => (
            <SelectItem key={view.id} value={view.id}>
              {view.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          // ビュー作成モーダルを開く処理は別途実装
        }}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
