//# frontend/lib/api.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: global error handling ──────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectStatus = "active" | "completed" | "delayed";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type UserRole = "developer" | "pm" | "ceo";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  created_at: string;
  task_count?: number;
  completion_percentage?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;
  assignee_id: string | null;
  assignee?: User;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
}

export interface Sprint {
  id: string;
  name: string;
  project_id: string;
  start_date: string;
  end_date: string;
  status: "active" | "completed" | "planned";
  velocity?: number;
  completion_rate?: number;
}

export interface DashboardStats {
  total_projects: number;
  active_tasks: number;
  delayed_sprints: number;
  team_members: number;
  ai_actions_today: number;
  completion_rate: number;
}

export interface RiskAlert {
  id: string;
  project_id: string;
  project_name: string;
  severity: "low" | "medium" | "critical";
  message: string;
  predicted_delay_days: number;
  created_at: string;
}

export interface AgentReport {
  id: string;
  type: "standup" | "weekly" | "sprint";
  content: string;
  project_id: string;
  project_name: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────

export const projectsApi = {
  getAll: () => api.get<Project[]>("/projects").then((r) => r.data),
  getById: (id: string) => api.get<Project>(`/projects/${id}`).then((r) => r.data),
  create: (payload: Omit<Project, "id" | "created_at">) =>
    api.post<Project>("/projects", payload).then((r) => r.data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// TASKS
// ─────────────────────────────────────────────────────────────────────────────

export const tasksApi = {
  getByProject: (projectId: string) =>
    api.get<Task[]>(`/tasks/project/${projectId}`).then((r) => r.data),
  getAll: () => api.get<Task[]>("/tasks").then((r) => r.data),
  create: (payload: Omit<Task, "id" | "created_at">) =>
    api.post<Task>("/tasks", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Task>) =>
    api.patch<Task>(`/tasks/${id}`, payload).then((r) => r.data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

export const usersApi = {
  getAll: () => api.get<User[]>("/users").then((r) => r.data),
  getById: (id: string) => api.get<User>(`/users/${id}`).then((r) => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// AI AGENTS
// ─────────────────────────────────────────────────────────────────────────────

export const agentsApi = {
  createTasks: (payload: { prd_text: string; project_id: string }) =>
    api.post("/agents/create-tasks", payload).then((r) => r.data),

  predictDelay: (payload: { project_id: string }) =>
    api.post<RiskAlert>("/agents/predict-delay", payload).then((r) => r.data),

  generateReport: (payload: { project_id: string; report_type: string }) =>
    api.post<AgentReport>("/agents/generate-report", payload).then((r) => r.data),

  standup: (payload: { project_id: string }) =>
    api.post<AgentReport>("/agents/standup", payload).then((r) => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>("/dashboard/stats").then((r) => r.data),
  getRiskAlerts: () => api.get<RiskAlert[]>("/dashboard/risks").then((r) => r.data),
  getReports: () => api.get<AgentReport[]>("/dashboard/reports").then((r) => r.data),
};
