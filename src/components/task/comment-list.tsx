import { useState } from "react";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useSession } from "next-auth/react";
import {  useToast } from "@/hooks/use-toast";

interface CommentListProps {
  taskId: string;
}

export function CommentList({ taskId }: CommentListProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const utils = api.useUtils();
  const { data: comments, isLoading } = api.comment.list.useQuery({ taskId });

  const { mutate: createComment, isPending: isCreating } = api.comment.create.useMutation({
    onSuccess: () => {
      setContent("");
      void utils.comment.list.invalidate({ taskId });
      toast({
        title: "コメントを追加しました",
      });
    },
    onError: (error) => {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteComment } = api.comment.delete.useMutation({
    onSuccess: () => {
      void utils.comment.list.invalidate({ taskId });
      toast({
        title: "コメントを削除しました",
      });
    },
    onError: (error) => {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    createComment({
      taskId,
      content: content.trim(),
    });
  }

  if (isLoading) {
    return <div className="text-center">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="コメントを入力..."
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isCreating || !content.trim()}>
            {isCreating ? "送信中..." : "コメントを追加"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.image ?? undefined} />
              <AvatarFallback>{comment.user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(comment.createdAt, "yyyy年MM月dd日 HH:mm", { locale: ja })}
                  </span>
                </div>
                {session?.user.id === comment.userId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("このコメントを削除しますか？")) {
                        deleteComment({ id: comment.id });
                      }
                    }}
                  >
                    削除
                  </Button>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 