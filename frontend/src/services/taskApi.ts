import { api } from "./api";

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: string;
  status: string;
}

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TaskItem[], void>({
      query: () => "/api/Tasks",
      providesTags: ["Tasks"],
    }),

    getTaskById: builder.query<TaskItem, string>({
      query: (id) => `/api/Tasks/${id}`,
      providesTags: ["Tasks"],
    }),

    createTask: builder.mutation<TaskItem, CreateTaskRequest>({
      query: (task) => ({
        url: "/api/Tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTask: builder.mutation<
      TaskItem,
      { id: string; task: CreateTaskRequest }
    >({
      query: ({ id, task }) => ({
        url: `/api/Tasks/${id}`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/Tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
