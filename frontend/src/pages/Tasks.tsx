import { useState, type FormEvent } from "react";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
  type TaskItem,
} from "../services/tasksApi";

type TaskStatus = "pending" | "completed";
type TaskPriority = "low" | "medium" | "high";
type TaskFilter = "all" | "pending" | "completed";

type Task = Omit<TaskItem, "priority" | "status"> & {
  priority: TaskPriority;
  status: TaskStatus;
};

function Tasks() {
  // GET /api/Tasks
  const { data: tasksData, isLoading, isError } = useGetTasksQuery();

  // POST /api/Tasks
  const [createTask] = useCreateTaskMutation();

  // PUT /api/Tasks/{id}
  const [updateTask] = useUpdateTaskMutation();

  // DELETE /api/Tasks/{id}
  const [deleteTask] = useDeleteTaskMutation();

  const tasks = (tasksData ?? []) as Task[];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const [filter, setFilter] = useState<TaskFilter>("all");
  const [search, setSearch] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      if (editingTaskId) {
        const existingTask = tasks.find((task) => task.id === editingTaskId);

        if (!existingTask) {
          return;
        }

        await updateTask({
          id: editingTaskId,
          task: {
            title: title.trim(),
            description: description.trim(),
            priority,
            status: existingTask.status,
          },
        }).unwrap();

        setEditingTaskId(null);
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim(),
          priority,
          status: "pending",
        }).unwrap();
      }

      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  }

  async function handleDelete(taskId: string) {
    try {
      await deleteTask(taskId).unwrap();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  async function handleToggleStatus(taskId: string) {
    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      return;
    }

    const newStatus: TaskStatus =
      task.status === "pending" ? "completed" : "pending";

    try {
      await updateTask({
        id: task.id,
        task: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: newStatus,
        },
      }).unwrap();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  }

  function handleEdit(task: Task) {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
  }

  function handleCancelEdit() {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setPriority("medium");
  }

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const pendingTasks = tasks.filter((task) => task.status === "pending").length;

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;

    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  function getPriorityClass(priority: TaskPriority) {
    if (priority === "high") {
      return "bg-red-400/10 text-red-300";
    }

    if (priority === "medium") {
      return "bg-yellow-400/10 text-yellow-300";
    }

    return "bg-green-400/10 text-green-300";
  }

  if (isLoading) {
    return <p className="text-slate-400">Loading tasks...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-300">Failed to load tasks from the backend.</p>
    );
  }

  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold text-white">Tasks</h1>
        <p className="mt-2 text-slate-400">
          Create, manage, and track your daily tasks.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Tasks</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{totalTasks}</h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-300">
            {pendingTasks}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Completed</p>
          <h2 className="mt-2 text-3xl font-bold text-green-300">
            {completedTasks}
          </h2>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-xl font-semibold text-white">
          {editingTaskId ? "Edit Task" : "Add New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
          />

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskPriority)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-teal-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-teal-300"
            >
              {editingTaskId ? "Update Task" : "Add Task"}
            </button>

            {editingTaskId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg border border-slate-700 px-4 py-3 font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Task List</h2>
            <p className="mt-1 text-sm text-slate-400">
              Search, filter, complete, edit, or delete your tasks.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-teal-400"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as TaskFilter)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-teal-400"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="mt-6 text-slate-400">No tasks found.</p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3
                      className={`font-medium ${
                        task.status === "completed"
                          ? "text-slate-500 line-through"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1 text-sm text-slate-400">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          task.status === "completed"
                            ? "bg-green-400/10 text-green-300"
                            : "bg-yellow-400/10 text-yellow-300"
                        }`}
                      >
                        {task.status}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </span>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(task.id)}
                      className="rounded-lg border border-teal-500/30 px-3 py-1 text-sm text-teal-300 transition hover:bg-teal-500/10"
                    >
                      {task.status === "completed" ? "Undo" : "Complete"}
                    </button>

                    <button
                      onClick={() => handleEdit(task)}
                      className="rounded-lg border border-slate-500/30 px-3 py-1 text-sm text-slate-300 transition hover:bg-slate-700/40"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="rounded-lg border border-red-500/30 px-3 py-1 text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Tasks;
