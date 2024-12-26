import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  // プロジェクト一覧を取得
  list: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // ワークスペースのメンバーかチェック
      const member = await ctx.db.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: input.workspaceId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!member) {
        throw new Error("Not authorized");
      }

      return ctx.db.project.findMany({
        where: {
          workspaceId: input.workspaceId,
        },
        include: {
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  // 特定のプロジェクトを取得
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        workspaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // ワークスペースのメンバーかチェック
      const member = await ctx.db.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: input.workspaceId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!member) {
        throw new Error("Not authorized");
      }

      const project = await ctx.db.project.findUnique({
        where: {
          id: input.id,
        },
        include: {
          sections: {
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
          },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    }),

  // プロジェクトを作成
  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        name: z.string().min(1, "プロジェクト名は必須です"),
        description: z.string().optional(),
        dueDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // ワークスペースのメンバーかチェック
      const member = await ctx.db.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: input.workspaceId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!member) {
        throw new Error("Not authorized");
      }

      return ctx.db.project.create({
        data: {
          workspaceId: input.workspaceId,
          name: input.name,
          description: input.description,
          dueDate: input.dueDate,
          sections: {
            create: [
              { name: "未着手", order: 0 },
              { name: "進行中", order: 1 },
              { name: "完了", order: 2 },
            ],
          },
        },
      });
    }),

  // プロジェクトを更新
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        workspaceId: z.string(),
        name: z.string().min(1, "プロジェクト名は必須です"),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        status: z.enum(["未着手", "進行中", "完了", "保留"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // ワークスペースのメンバーかチェック
      const member = await ctx.db.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: input.workspaceId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!member) {
        throw new Error("Not authorized");
      }

      const project = await ctx.db.project.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return ctx.db.project.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          dueDate: input.dueDate,
          status: input.status,
        },
      });
    }),

  // プロジェクトを削除
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        workspaceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // ワークスペースのメンバーかチェック
      const member = await ctx.db.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: input.workspaceId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!member) {
        throw new Error("Not authorized");
      }

      const project = await ctx.db.project.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return ctx.db.project.delete({
        where: {
          id: input.id,
        },
      });
    }),
}); 