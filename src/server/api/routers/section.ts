import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const sectionRouter = createTRPCRouter({
  // セクション一覧を取得
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // プロジェクトの存在確認とアクセス権チェック
      const project = await ctx.db.project.findUnique({
        where: {
          id: input.projectId,
        },
        include: {
          workspace: {
            include: {
              members: true,
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      const isMember = project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      return ctx.db.section.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          tasks: {
            include: {
              assignee: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      });
    }),

  // セクションを作成
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1, "セクション名は必須です"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // プロジェクトの存在確認とアクセス権チェック
      const project = await ctx.db.project.findUnique({
        where: {
          id: input.projectId,
        },
        include: {
          workspace: {
            include: {
              members: true,
            },
          },
          sections: {
            orderBy: {
              order: "desc",
            },
            take: 1,
          },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      const isMember = project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      // 新しいセクションの順序を設定
      const lastOrder = project.sections[0]?.order ?? -1;
      const newOrder = lastOrder + 1;

      return ctx.db.section.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          order: newOrder,
        },
      });
    }),

  // セクションを更新
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "セクション名は必須です"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // セクションの存在確認とアクセス権チェック
      const section = await ctx.db.section.findUnique({
        where: {
          id: input.id,
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

      if (!section) {
        throw new Error("Section not found");
      }

      const isMember = section.project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      return ctx.db.section.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  // セクションを削除
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // セクションの存在確認とアクセス権チェック
      const section = await ctx.db.section.findUnique({
        where: {
          id: input.id,
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

      if (!section) {
        throw new Error("Section not found");
      }

      const isMember = section.project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      return ctx.db.section.delete({
        where: {
          id: input.id,
        },
      });
    }),

  // セクションの順序を更新
  reorder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        order: z.number().int().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // セクションの存在確認とアクセス権チェック
      const section = await ctx.db.section.findUnique({
        where: {
          id: input.id,
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

      if (!section) {
        throw new Error("Section not found");
      }

      const isMember = section.project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      // 他のセクションの順序を更新
      await ctx.db.section.updateMany({
        where: {
          projectId: section.projectId,
          order: {
            gte: input.order,
          },
          id: {
            not: input.id,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });

      return ctx.db.section.update({
        where: {
          id: input.id,
        },
        data: {
          order: input.order,
        },
      });
    }),
}); 