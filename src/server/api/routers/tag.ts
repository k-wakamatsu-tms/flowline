import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tagRouter = createTRPCRouter({
  // タグ一覧を取得
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.tag.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }),

  // タグを作成
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "タグ名は必須です"),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "有効なカラーコードを指定してください"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 同じ名前のタグが存在しないかチェック
      const existingTag = await ctx.db.tag.findFirst({
        where: {
          name: input.name,
        },
      });

      if (existingTag) {
        throw new Error("同じ名前のタグが既に存在します");
      }

      return ctx.db.tag.create({
        data: {
          name: input.name,
          color: input.color,
        },
      });
    }),

  // タグを更新
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "タグ名は必須です"),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "有効なカラーコードを指定してください"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // タグの存在確認
      const tag = await ctx.db.tag.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!tag) {
        throw new Error("Tag not found");
      }

      // 同じ名前の別のタグが存在しないかチェック
      const existingTag = await ctx.db.tag.findFirst({
        where: {
          name: input.name,
          id: {
            not: input.id,
          },
        },
      });

      if (existingTag) {
        throw new Error("同じ名前のタグが既に存在します");
      }

      return ctx.db.tag.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          color: input.color,
        },
      });
    }),

  // タグを削除
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // タグの存在確認
      const tag = await ctx.db.tag.findUnique({
        where: {
          id: input.id,
        },
        include: {
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

      if (!tag) {
        throw new Error("Tag not found");
      }

      // タグが使用されているかチェック
      if (tag._count.tasks > 0) {
        throw new Error("このタグは使用中のため削除できません");
      }

      return ctx.db.tag.delete({
        where: {
          id: input.id,
        },
      });
    }),

  // タグでタスクを検索
  searchTasks: protectedProcedure
    .input(z.object({ tagId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          tags: {
            some: {
              tagId: input.tagId,
            },
          },
          project: {
            workspace: {
              members: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          },
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              workspace: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          section: {
            select: {
              id: true,
              name: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
}); 