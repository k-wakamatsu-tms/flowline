export interface Task {
  id: string;
  name: string;
  description?: string;
  projectIds: string[];
  sectionId?: string;
  section?: {
    id: string;
    name: string;
    color: string;
  };
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: "高" | "中" | "低";
  status: "未着手" | "進行中" | "レビュー待ち" | "完了" | "保留";
  tags: string[];
  parentTaskId?: string;
}
