import { createCallerFactory, createTRPCRouter } from "./trpc";
import { workspaceRouter } from "./routers/workspace";
import { projectRouter } from "./routers/project";
import { taskRouter } from "./routers/task";
import { sectionRouter } from "./routers/section";
import { tagRouter } from "./routers/tag";
import { commentRouter } from "./routers/comment";
import { attachmentRouter } from "./routers/attachment";
import { notificationRouter } from "./routers/notification";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workspace: workspaceRouter,
  project: projectRouter,
  task: taskRouter,
  section: sectionRouter,
  tag: tagRouter,
  comment: commentRouter,
  attachment: attachmentRouter,
  notification: notificationRouter,
});

// APIの型定義をエクスポート
export type AppRouter = typeof appRouter;
/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

