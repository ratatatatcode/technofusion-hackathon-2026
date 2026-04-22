// ---------------------------------------------------------------------------
// Thin fetch wrapper used by `lib/api.ts`. If `NEXT_PUBLIC_API_BASE_URL` is
// not configured the wrapper throws `MockFallbackError` and the caller
// resolves with mock data (see lib/mockData.ts). This keeps the UI functional
// during frontend development and keeps the backend contract explicit.
// ---------------------------------------------------------------------------

export class MockFallbackError extends Error {
  constructor() {
    super("NEXT_PUBLIC_API_BASE_URL not configured; falling back to mock data.");
    this.name = "MockFallbackError";
  }
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

const AUTH_STORAGE_KEY = "missionquest.authToken";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token === null) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      window.localStorage.setItem(AUTH_STORAGE_KEY, token);
    }
  } catch {
    // ignore
  }
}

function getBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw || raw.trim() === "") return null;
  return raw.replace(/\/+$/, "");
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = getBaseUrl();
  if (!base) throw new MockFallbackError();

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${cleanPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, headers = {}, signal } = options;
  const url = buildUrl(path, query);

  const token = getAuthToken();
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    cache: "no-store",
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload: unknown = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload && typeof (payload as { message: unknown }).message === "string"
        ? (payload as { message: string }).message
        : `${method} ${path} failed with ${response.status}`);
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
