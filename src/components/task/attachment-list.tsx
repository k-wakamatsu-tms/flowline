import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { FileIcon, Loader2Icon, TrashIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { formatBytes } from "@/lib/utils";

interface AttachmentListProps {
  taskId: string;
}

export function AttachmentList({ taskId }: AttachmentListProps) {
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);

  const utils = api.useUtils();
  const { data: attachments, isLoading } = api.attachment.list.useQuery({ taskId });

  const { mutate: createAttachment } = api.attachment.create.useMutation({
    onSuccess: () => {
      void utils.attachment.list.invalidate({ taskId });
      toast({
        title: "ファイルをアップロードしました",
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

  const { mutate: deleteAttachment } = api.attachment.delete.useMutation({
    onSuccess: () => {
      void utils.attachment.list.invalidate({ taskId });
      toast({
        title: "ファイルを削除しました",
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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: 実際のファイルアップロード処理を実装
      // ここではモックとして直接APIを呼び出しています
      createAttachment({
        taskId,
        name: file.name,
        url: "https://example.com/files/" + file.name,
        size: file.size,
        type: file.type,
      });
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "ファイルのアップロードに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  if (isLoading) {
    return <div className="text-center">読み込み中...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="file"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button asChild disabled={isUploading}>
            <span>
              {isUploading ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  アップロード中...
                </>
              ) : (
                "ファイルを追加"
              )}
            </span>
          </Button>
        </label>
      </div>

      <div className="space-y-2">
        {attachments?.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileIcon className="w-5 h-5 text-blue-500" />
              <div>
                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline"
                >
                  {attachment.fileName}
                </a>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(attachment.fileSize)}
                </p>
              </div>
            </div>
            {session?.user.id === attachment.userId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm("このファイルを削除しますか？")) {
                    deleteAttachment({ id: attachment.id });
                  }
                }}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 