import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  // コメント一覧を取得
  list: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
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
          createdAt: "asc",
        },
      });
    }),

  // コメントを作成
  create: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        content: z.string().min(1, "コメントを入力してください"),
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

      const comment = await ctx.db.comment.create({
        data: {
          taskId: input.taskId,
          userId: ctx.session.user.id,
          content: input.content,
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
            title: "タスクにコメントが追加されました",
            content: `${ctx.session.user.name}さんがタスク「${task.name}」にコメントを追加しました。`,
          },
        });
      }

      return comment;
    }),

  // コメントを更新
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1, "コメントを入力してください"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      // 自分のコメントかチェック
      if (comment.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.comment.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
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
    }),

  // コメントを削除
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      // 自分のコメントかチェック
      if (comment.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.comment.delete({
        where: {
          id: input.id,
        },
      });
    }),
}); 