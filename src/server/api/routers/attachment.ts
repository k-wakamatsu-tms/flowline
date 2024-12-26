import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const attachmentRouter = createTRPCRouter({
  // 添付ファイル一覧を取得
  list: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.attachment.findMany({
        where: {
          taskId: input.taskId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  // 添付ファイルを作成
  create: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        name: z.string().min(1, "ファイル名は必須です"),
        url: z.string().url("有効なURLを指定してください"),
        size: z.number().min(0, "ファイルサイズは0以上である必要があります"),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // タスクの存在確認とアクセス権のチェック
      const task = await ctx.db.task.findUnique({
        where: {
          id: input.taskId,
        },
        include: {
          project: {
            include: {
              workspace: {
                include: {
                  members: true,
                },
              },
            },
          },
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      // ワークスペースのメンバーかチェック
      const isMember = task.project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      const attachment = await ctx.db.attachment.create({
        data: {
          taskId: input.taskId,
          userId: ctx.session.user.id,
          fileName: input.name,
          fileUrl: input.url,
          fileSize: input.size,
          fileType: input.type,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      // タスクの担当者に通知を送信
      if (task.assigneeId && task.assigneeId !== ctx.session.user.id) {
        await ctx.db.notification.create({
          data: {
            userId: task.assigneeId,
            title: "タスクにファイルが追加されました",
            content: `${ctx.session.user.name}さんがタスク「${task.name}」にファイル「${input.name}」を追加しました。`,
          },
        });
      }

      return attachment;
    }),

  // 添付ファイルを削除
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const attachment = await ctx.db.attachment.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!attachment) {
        throw new Error("Attachment not found");
      }

      // 自分の添付ファイルかチェック
      if (attachment.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.attachment.delete({
        where: {
          id: input.id,
        },
      });
    }),
}); 