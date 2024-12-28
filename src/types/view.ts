export type ViewType =
  | "リスト"
  | "ボード"
  | "タイムライン"
  | "ガント"
  | "カレンダー";

export interface ProjectView {
  id: string;
  name: string;
  projectId: string;
  type: ViewType;
  isDefault: boolean;
  filters: Record<string, unknown>;
  sort: {
    field: string;
    direction: "asc" | "desc";
  };
  groupBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyTasksView {
  id: string;
  userId: string;
  name: string;
  type: ViewType;
  isDefault: boolean;
  filters: Record<string, unknown>;
  sort: {
    field: string;
    direction: "asc" | "desc";
  };
  groupBy?: string;
  createdAt: string;
  updatedAt: string;
}
