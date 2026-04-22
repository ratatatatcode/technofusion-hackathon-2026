// ---------------------------------------------------------------------------
// Resource-level API functions. Each function calls the Express backend via
// `request()` and, if the backend is not configured, transparently resolves
// with fixtures from `mockData.ts`. Frontend components only ever depend on
// this module so swapping in the real backend is a zero-touch change.
// ---------------------------------------------------------------------------

import { MockFallbackError, request } from "./apiClient";
import {
  mockAdminDashboard,
  mockAdminLeaderboard,
  mockCatalog,
  mockCurrentUser,
  mockInnovationWall,
  mockMissions,
  mockProblems,
  mockStudentDashboard,
  mockStudentLeaderboard,
  mockSubmissions,
} from "./mockData";
import type {
  AdminDashboard,
  AdminLeaderboard,
  Catalog,
  InnovationWall,
  LoginInput,
  LoginResponse,
  Mission,
  MissionCreateInput,
  MissionStatus,
  MissionUpdateInput,
  Problem,
  ProblemCreateInput,
  StudentDashboard,
  StudentLeaderboard,
  Submission,
  SubmissionCreateInput,
  SubmissionStatus,
  User,
} from "./types";

async function withMockFallback<T>(call: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await call();
  } catch (error) {
    if (error instanceof MockFallbackError) return fallback;
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[api] request failed, using mock fallback:", error);
      return fallback;
    }
    throw error;
  }
}

// ---- Catalog ---------------------------------------------------------------

export function getCatalog(): Promise<Catalog> {
  return withMockFallback(() => request<Catalog>("/catalog"), mockCatalog);
}

// ---- Missions --------------------------------------------------------------

export type MissionFilters = {
  department?: string;
  tier?: string;
  status?: MissionStatus;
};

export function getMissions(filters: MissionFilters = {}): Promise<Mission[]> {
  return withMockFallback(
    () => request<Mission[]>("/missions", { query: filters }),
    mockMissions.filter(
      (m) =>
        (!filters.department || m.department === filters.department) &&
        (!filters.tier || m.tier === filters.tier) &&
        (!filters.status || m.status === filters.status)
    )
  );
}

export function getMission(id: string): Promise<Mission | null> {
  return withMockFallback(
    () => request<Mission>(`/missions/${id}`),
    mockMissions.find((m) => m.id === id) ?? null
  );
}

export function createMission(input: MissionCreateInput): Promise<Mission> {
  return withMockFallback(
    () => request<Mission>("/missions", { method: "POST", body: input }),
    {
      ...input,
      id: `m-${Date.now()}`,
      status: input.status ?? "draft",
      participants: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Mission
  );
}

export function updateMission(id: string, patch: MissionUpdateInput): Promise<Mission> {
  return withMockFallback(
    () => request<Mission>(`/missions/${id}`, { method: "PATCH", body: patch }),
    { ...(mockMissions.find((m) => m.id === id) as Mission), ...patch, updatedAt: new Date().toISOString() }
  );
}

export function endMission(id: string): Promise<Mission> {
  return updateMission(id, { status: "ended" });
}

// ---- Submissions -----------------------------------------------------------

export type SubmissionFilters = { status?: SubmissionStatus };

export function getSubmissions(filters: SubmissionFilters = {}): Promise<Submission[]> {
  return withMockFallback(
    () => request<Submission[]>("/submissions", { query: filters }),
    mockSubmissions.filter((s) => !filters.status || s.status === filters.status)
  );
}

export function createSubmission(input: SubmissionCreateInput): Promise<Submission> {
  return withMockFallback(
    () => request<Submission>("/submissions", { method: "POST", body: input }),
    {
      id: `s-${Date.now()}`,
      missionId: input.missionId,
      missionTitle: "Pending review",
      missionTier: "bronze",
      playerId: mockCurrentUser.id,
      playerName: mockCurrentUser.name,
      playerDepartment: mockCurrentUser.department,
      playerYear: mockCurrentUser.year ?? "",
      summary: input.summary,
      photoUrl: input.photoUrl ?? null,
      linkUrl: input.linkUrl ?? null,
      eventCode: input.eventCode ?? null,
      status: "pending",
      submittedAt: new Date().toISOString(),
    }
  );
}

export function approveSubmission(id: string): Promise<Submission> {
  return withMockFallback(
    () => request<Submission>(`/submissions/${id}/approve`, { method: "POST" }),
    { ...(mockSubmissions.find((s) => s.id === id) as Submission), status: "approved" }
  );
}

export function rejectSubmission(id: string, reason: string): Promise<Submission> {
  return withMockFallback(
    () => request<Submission>(`/submissions/${id}/reject`, { method: "POST", body: { reason } }),
    { ...(mockSubmissions.find((s) => s.id === id) as Submission), status: "rejected", rejectionReason: reason }
  );
}

// ---- Problem board ---------------------------------------------------------

export function getProblems(): Promise<Problem[]> {
  return withMockFallback(() => request<Problem[]>("/problems"), mockProblems);
}

export function createProblem(input: ProblemCreateInput): Promise<Problem> {
  return withMockFallback(
    () => request<Problem>("/problems", { method: "POST", body: input }),
    {
      id: `p-${Date.now()}`,
      title: input.description.slice(0, 60).toUpperCase(),
      description: input.description,
      location: input.location,
      postedByRole: input.postedByRole,
      postedByName: "You",
      upvotes: 0,
      createdAt: new Date().toISOString(),
      quests: [],
    }
  );
}

// ---- Dashboards ------------------------------------------------------------

export function getStudentDashboard(): Promise<StudentDashboard> {
  return withMockFallback(() => request<StudentDashboard>("/me/dashboard"), mockStudentDashboard);
}

export function getAdminDashboard(): Promise<AdminDashboard> {
  return withMockFallback(() => request<AdminDashboard>("/admin/dashboard"), mockAdminDashboard);
}

// ---- Leaderboards ----------------------------------------------------------

export function getStudentLeaderboard(): Promise<StudentLeaderboard> {
  return withMockFallback(
    () => request<StudentLeaderboard>("/leaderboard/students"),
    mockStudentLeaderboard
  );
}

export function getAdminLeaderboard(): Promise<AdminLeaderboard> {
  return withMockFallback(
    () => request<AdminLeaderboard>("/leaderboard/admin"),
    mockAdminLeaderboard
  );
}

// ---- Innovation wall -------------------------------------------------------

export function getInnovationWall(): Promise<InnovationWall> {
  return withMockFallback(() => request<InnovationWall>("/innovation-wall"), mockInnovationWall);
}

// ---- Auth ------------------------------------------------------------------

export function login(input: LoginInput): Promise<LoginResponse> {
  return withMockFallback(
    () => request<LoginResponse>("/auth/login", { method: "POST", body: input }),
    { token: "mock-token", user: { ...mockCurrentUser, role: input.role } }
  );
}

export function logout(): Promise<void> {
  return withMockFallback(() => request<void>("/auth/logout", { method: "POST" }), undefined);
}

export function getCurrentUser(): Promise<User> {
  return withMockFallback(() => request<User>("/auth/me"), mockCurrentUser);
}
