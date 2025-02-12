import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
  // 通知一覧を取得
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.string().optional(), // カーソルベースのページネーション用
        unreadOnly: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.notification.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.unreadOnly ? { read: false } : {}),
        },
        take: input.limit + 1, // 次のページがあるかチェックするため1つ多く取得
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // 未読の通知数を取得
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.notification.count({
      where: {
        userId: ctx.session.user.id,
        read: false,
      },
    });
  }),

  // 通知を既読にする
  markAsRead: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!notification) {
        throw new Error("Notification not found");
      }

      // 自分の通知かチェック
      if (notification.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.notification.update({
        where: {
          id: input.id,
        },
        data: {
          read: true,
        },
      });
    }),

  // すべての通知を既読にする
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.notification.updateMany({
      where: {
        userId: ctx.session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }),

  // 通知を作成（内部用）
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notification.create({
        data: {
          userId: input.userId,
          title: input.title,
          content: input.content,
        },
      });
    }),

  // 通知を削除
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!notification) {
        throw new Error("Notification not found");
      }

      // 自分の通知かチェック
      if (notification.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.notification.delete({
        where: {
          id: input.id,
        },
      });
    }),

  // 古い通知を削除（内部用、定期的なクリーンアップ用）
  deleteOld: protectedProcedure
    .input(
      z.object({
        olderThan: z.date(), // この日付より古い通知を削除
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notification.deleteMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            lt: input.olderThan,
          },
          read: true, // 既読の通知のみ削除
        },
      });
    }),

  // 通知を作成するヘルパー関数群
  helpers: {
    // タスクの担当者が変更された
    taskAssigned: protectedProcedure
      .input(
        z.object({
          taskId: z.string(),
          assigneeId: z.string(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const task = await ctx.db.task.findUnique({
          where: { id: input.taskId },
          include: {
            project: true,
          },
        });

        if (!task) {
          throw new Error("Task not found");
        }

        return ctx.db.notification.create({
          data: {
            userId: input.assigneeId,
            title: "タスクが割り当てられました",
            content: `タスク「${task.name}」（プロジェクト：${task.project.name}）があなたに割り当てられました。`,
          },
        });
      }),

    // タスクの期限が近づいている
    taskDueSoon: protectedProcedure
      .input(
        z.object({
          taskId: z.string(),
          assigneeId: z.string(),
          daysUntilDue: z.number(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const task = await ctx.db.task.findUnique({
          where: { id: input.taskId },
          include: {
            project: true,
          },
        });

        if (!task) {
          throw new Error("Task not found");
        }

        return ctx.db.notification.create({
          data: {
            userId: input.assigneeId,
            title: "タスクの期限が近づいています",
            content: `タスク「${task.name}」（プロジェクト：${task.project.name}）の期限まであと${input.daysUntilDue}日です。`,
          },
        });
      }),

    // タスクにコメントが追加された
    taskCommented: protectedProcedure
      .input(
        z.object({
          taskId: z.string(),
          commenterId: z.string(),
          assigneeId: z.string(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const task = await ctx.db.task.findUnique({
          where: { id: input.taskId },
          include: {
            project: true,
          },
        });

        if (!task) {
          throw new Error("Task not found");
        }

        const commenter = await ctx.db.user.findUnique({
          where: { id: input.commenterId },
        });

        if (!commenter) {
          throw new Error("Commenter not found");
        }

        return ctx.db.notification.create({
          data: {
            userId: input.assigneeId,
            title: "タスクにコメントが追加されました",
            content: `${commenter.name}さんがタスク「${task.name}」（プロジェクト：${task.project.name}）にコメントを追加しました。`,
          },
        });
      }),
  },
}); 