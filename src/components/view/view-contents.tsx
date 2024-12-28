"use client";

import { type ViewType } from "@/types/view";
import { type Task } from "@/types/task";

interface ViewContentProps {
  type: ViewType;
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}

export function ViewContent({ type, tasks, onTaskUpdate }: ViewContentProps) {
  switch (type) {
    case "overview":
      return <OverviewContent tasks={tasks} onTaskUpdate={onTaskUpdate} />;
    case "list":
      return <ListContent tasks={tasks} onTaskUpdate={onTaskUpdate} />;
    case "board":
      return <BoardContent tasks={tasks} onTaskUpdate={onTaskUpdate} />;
    case "timeline":
      return <TimelineContent tasks={tasks} onTaskUpdate={onTaskUpdate} />;
    case "gantt":
      return <GanttContent tasks={tasks} onTaskUpdate={onTaskUpdate} />;
    case "calendar":
      return <CalendarContent tasks={tasks} onTaskUpdate={onTaskUpdate} />;
    default:
      return null;
  }
}

function OverviewContent({
  tasks,
  onTaskUpdate,
}: {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="全タスク" value={tasks.length} />
        <StatCard
          title="未完了"
          value={tasks.filter((t) => t.status !== "完了").length}
        />
        <StatCard
          title="期限切れ"
          value={
            tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date())
              .length
          }
        />
        <StatCard
          title="高優先度"
          value={tasks.filter((t) => t.priority === "高").length}
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">最近のタスク</h2>
        <div className="space-y-2">
          {tasks
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            )
            .slice(0, 5)
            .map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} />
            ))}
        </div>
      </div>
    </div>
  );
}

function ListContent({
  tasks,
  onTaskUpdate,
}: {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} />
      ))}
    </div>
  );
}

function BoardContent({
  tasks,
  onTaskUpdate,
}: {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}) {
  const sections = Array.from(new Set(tasks.map((t) => t.sectionId)));

  return (
    <div className="grid auto-cols-fr grid-flow-col gap-4">
      {sections.map((sectionId) => (
        <div key={sectionId} className="w-80 space-y-4">
          <h3 className="font-semibold">
            {tasks.find((t) => t.sectionId === sectionId)?.section?.name}
          </h3>
          <div className="space-y-2">
            {tasks
              .filter((t) => t.sectionId === sectionId)
              .map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineContent({
  tasks,
}: {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}) {
  return <div>Timeline View (実装予定)</div>;
}

function GanttContent({
  tasks,
}: {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}) {
  return <div>Gantt View (実装予定)</div>;
}

function CalendarContent({
  tasks,
}: {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}) {
  return <div>Calendar View (実装予定)</div>;
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function TaskCard({
  task,
  onUpdate,
}: {
  task: Task;
  onUpdate: (task: Task) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <div className="font-medium">{task.name}</div>
        <div className="text-sm text-muted-foreground">
          {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={cn("text-sm", {
            "text-red-500": task.priority === "高",
            "text-yellow-500": task.priority === "中",
            "text-green-500": task.priority === "低",
          })}
        >
          {task.priority}
        </div>
        <div
          className={cn("text-sm", {
            "text-blue-500": task.status === "進行中",
            "text-green-500": task.status === "完了",
            "text-yellow-500": task.status === "保留",
          })}
        >
          {task.status}
        </div>
      </div>
    </div>
  );
}
