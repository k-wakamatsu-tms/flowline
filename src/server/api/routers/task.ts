import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const taskRouter = createTRPCRouter({
  // タスク一覧を取得
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        sectionId: z.string().optional(),
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

      return ctx.db.task.findMany({
        where: {
          projectId: input.projectId,
          sectionId: input.sectionId,
        },
        include: {
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
          _count: {
            select: {
              comments: true,
              attachments: true,
              subTasks: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  // 特定のタスクを取得
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
        where: { id: input.id },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              emailVerified: true,
              image: true,
            },
          },
          project: true,
          section: true,
          tags: {
            include: {
              tag: true,
            },
          },
          comments: {
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
          },
          attachments: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "タスクが見つかりません",
        });
      }

      return task;
    }),

  // タスクを作成
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        sectionId: z.string(),
        name: z.string().min(1, "タスク名は必須です"),
        description: z.string().optional(),
        assigneeId: z.string().optional(),
        dueDate: z.date().optional(),
        priority: z.enum(["高", "中", "低"]).optional(),
        parentTaskId: z.string().optional(),
        tagIds: z.array(z.string()).optional(),
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

      // セクションの存在確認
      const section = await ctx.db.section.findUnique({
        where: {
          id: input.sectionId,
        },
      });

      if (!section) {
        throw new Error("Section not found");
      }

      // 親タスクの存在確認（指定されている場合）
      if (input.parentTaskId) {
        const parentTask = await ctx.db.task.findUnique({
          where: {
            id: input.parentTaskId,
          },
        });

        if (!parentTask) {
          throw new Error("Parent task not found");
        }
      }

      return ctx.db.task.create({
        data: {
          projectId: input.projectId,
          sectionId: input.sectionId,
          name: input.name,
          description: input.description,
          assigneeId: input.assigneeId,
          dueDate: input.dueDate,
          priority: input.priority,
          parentTaskId: input.parentTaskId,
          tags: input.tagIds
            ? {
                create: input.tagIds.map((tagId) => ({
                  tag: {
                    connect: {
                      id: tagId,
                    },
                  },
                })),
              }
            : undefined,
        },
        include: {
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
      });
    }),

  // タスクを更新
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "タスク名は必須です"),
        description: z.string().optional(),
        assigneeId: z.string().optional(),
        dueDate: z.date().optional(),
        priority: z.enum(["高", "中", "低"]).optional(),
        status: z.enum(["未着手", "進行中", "レビュー待ち", "完了", "保留"]),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
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
          tags: true,
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      const isMember = task.project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      // 既存のタグを削除
      if (input.tagIds) {
        await ctx.db.taskTag.deleteMany({
          where: {
            taskId: input.id,
          },
        });
      }

      return ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          assigneeId: input.assigneeId,
          dueDate: input.dueDate,
          priority: input.priority,
          status: input.status,
          tags: input.tagIds
            ? {
                create: input.tagIds.map((tagId) => ({
                  tag: {
                    connect: {
                      id: tagId,
                    },
                  },
                })),
              }
            : undefined,
        },
        include: {
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
      });
    }),

  // タスクを削除
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
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

      if (!task) {
        throw new Error("Task not found");
      }

      const isMember = task.project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      return ctx.db.task.delete({
        where: {
          id: input.id,
        },
      });
    }),

  // タスクのセクションを変更
  moveToSection: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        sectionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
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

      if (!task) {
        throw new Error("Task not found");
      }

      const isMember = task.project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      // セクションの存在確認
      const section = await ctx.db.section.findUnique({
        where: {
          id: input.sectionId,
        },
      });

      if (!section) {
        throw new Error("Section not found");
      }

      return ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          sectionId: input.sectionId,
        },
      });
    }),

  // コメントを追加
  addComment: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        content: z.string().min(1, "コメントは必須です"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      const isMember = task.project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      return ctx.db.comment.create({
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
    }),

  // 添付ファイルを追加
  addAttachment: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      const isMember = task.project.workspace.members.some(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!isMember) {
        throw new Error("Not authorized");
      }

      return ctx.db.attachment.create({
        data: {
          taskId: input.taskId,
          userId: ctx.session.user.id,
          fileName: input.fileName,
          fileUrl: input.fileUrl,
          fileSize: input.fileSize,
          fileType: input.fileType,
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
}); 