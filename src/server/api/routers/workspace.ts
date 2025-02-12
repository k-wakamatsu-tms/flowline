import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const workspaceRouter = createTRPCRouter({
  // ワークスペース一覧を取得
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.workspace.findMany({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });
  }),

  // 特定のワークスペースを取得
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.db.workspace.findUnique({
        where: { id: input.id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // メンバーかどうかチェック
      const isMember = workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      return workspace;
    }),

  // ワークスペースを作成
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "ワークスペース名は必須です"),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.create({
        data: {
          name: input.name,
          description: input.description,
          ownerId: ctx.session.user.id,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "owner",
            },
          },
        },
      });
    }),

  // ワークスペースを更新
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "ワークスペース名は必須です"),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.workspace.findUnique({
        where: { id: input.id },
        include: {
          members: true,
        },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // オーナーかどうかチェック
      if (workspace.ownerId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.workspace.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  // ワークスペースを削除
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.workspace.findUnique({
        where: { id: input.id },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // オーナーかどうかチェック
      if (workspace.ownerId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.workspace.delete({
        where: { id: input.id },
      });
    }),

  // メンバーを招待
  inviteMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.workspace.findUnique({
        where: { id: input.workspaceId },
        include: {
          members: true,
        },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // オーナーかどうかチェック
      if (workspace.ownerId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      // すでにメンバーかどうかチェック
      const isAlreadyMember = workspace.members.some(
        (member) => member.userId === input.userId,
      );

      if (isAlreadyMember) {
        throw new Error("User is already a member");
      }

      return ctx.db.workspaceMember.create({
        data: {
          workspaceId: input.workspaceId,
          userId: input.userId,
          role: "member",
        },
      });
    }),

  // メンバーを削除
  removeMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.workspace.findUnique({
        where: { id: input.workspaceId },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // オーナーかどうかチェック
      if (workspace.ownerId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      // オーナーは削除できない
      if (input.userId === workspace.ownerId) {
        throw new Error("Cannot remove owner");
      }

      return ctx.db.workspaceMember.delete({
        where: {
          workspaceId_userId: {
            workspaceId: input.workspaceId,
            userId: input.userId,
          },
        },
      });
    }),
}); 