# MissionQuest — Backend Integration Guide

This document is the contract between the **Next.js frontend** in this repo
and the **Express backend** that will power it. Build the backend to match
these endpoints and the frontend will switch from mock data to live data by
just filling in `NEXT_PUBLIC_API_BASE_URL`.

---

## 1. How the frontend consumes the API

```
app/            Next.js pages (server components fetch via lib/api.ts)
components/    Presentational React components
lib/
  types.ts      TypeScript domain models (source of truth for shapes)
  apiClient.ts  Thin fetch wrapper + auth token helpers
  api.ts        One function per resource. Uses mock data as a fallback
                whenever NEXT_PUBLIC_API_BASE_URL is not configured or a
                request fails in development.
  mockData.ts   Fixtures that mirror the backend payloads exactly.
```

All field names use **camelCase**. All enumerations are lowercase strings:

| Enum               | Allowed values                                     |
| ------------------ | -------------------------------------------------- |
| `MissionTier`      | `bronze` · `silver` · `gold` · `contest`           |
| `MissionStatus`    | `live` · `draft` · `ended`                         |
| `SubmissionStatus` | `pending` · `approved` · `rejected`                |
| `UserRole`         | `student` · `admin`                                |
| `ProblemAuthorRole`| `student` · `faculty` · `staff`                    |

When your Express server returns JSON it **must** match these casings.

---

## 2. Recommended backend stack

- Node.js 20+
- **Express 4** (or 5)
- TypeScript (share `lib/types.ts` via a monorepo package or copy-paste)
- A database of your choice (Prisma + PostgreSQL recommended)
- `jsonwebtoken` for auth
- `zod` for request validation
- `cors` middleware so the Next.js dev server (`http://localhost:3000`) can
  talk to the API (`http://localhost:4000`)

Suggested project layout:

```
backend/
  src/
    index.ts           app bootstrap
    routes/
      auth.ts
      missions.ts
      submissions.ts
      problems.ts
      leaderboard.ts
      innovationWall.ts
      dashboard.ts
      catalog.ts
    middleware/
      auth.ts          verifies Bearer tokens, attaches req.user
      error.ts         normalizes errors to { message, code }
    services/          business logic
    db/                prisma client / migrations
    types.ts           copied from frontend/lib/types.ts
  package.json
  tsconfig.json
  .env
```

---

## 3. Global request & response conventions

- **Base path:** everything lives under `/api`. Example full URL:
  `http://localhost:4000/api/missions`.
- **Content-Type:** `application/json` for every request/response (except
  proof photo upload — see §6).
- **Auth:** after `POST /api/auth/login` the frontend stores the returned
  `token` in `localStorage` (`missionquest.authToken`) and sends it on every
  subsequent request as `Authorization: Bearer <token>`.
- **Errors:** non-2xx responses must return JSON of the form
  `{ "message": "Human readable reason", "code": "OPTIONAL_CODE" }`. The
  frontend surfaces `message` to the user.
- **Timestamps:** ISO-8601 strings in UTC (`2026-04-22T08:00:00.000Z`).
- **Pagination:** not required for MVP — return plain arrays. Add
  `{ items, page, total }` later if needed.

### CORS (required)

```ts
import cors from "cors";
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  credentials: true,
}));
```

---

## 4. Endpoint reference

All schemas below correspond to exported types in
[`lib/types.ts`](lib/types.ts). Use that file as the source of truth.

### 4.1 Auth

| Method | Path              | Description                           | Auth |
| ------ | ----------------- | ------------------------------------- | ---- |
| POST   | `/auth/login`     | Exchange credentials for a token      | No   |
| POST   | `/auth/logout`    | Invalidate current token              | Yes  |
| GET    | `/auth/me`        | Return the authenticated `User`       | Yes  |

**POST `/auth/login`**

```jsonc
// request body (LoginInput)
{
  "schoolId": "2026-00001",
  "password": "hunter2",
  "role": "student"         // "student" | "admin"
}

// response (LoginResponse)
{
  "token": "eyJhbGciOi...",
  "user": { /* User */ }
}
```

### 4.2 Catalog (dropdown options)

| Method | Path        | Returns   |
| ------ | ----------- | --------- |
| GET    | `/catalog`  | `Catalog` |

Used by the Mission form for departments / tiers / SDGs / categories /
durations. You can hard-code this server-side for MVP.

### 4.3 Missions

| Method | Path             | Description                              | Auth         |
| ------ | ---------------- | ---------------------------------------- | ------------ |
| GET    | `/missions`      | List missions. Query: `department`, `tier`, `status` | Optional |
| GET    | `/missions/:id`  | Get a single mission                     | Optional     |
| POST   | `/missions`      | Create mission (`MissionCreateInput`)    | Admin        |
| PATCH  | `/missions/:id`  | Update (`MissionUpdateInput`)            | Admin        |
| POST   | `/missions/:id/end` _(optional helper)_ | Shortcut to set `status = "ended"` | Admin |

`Mission` payload shape — see `lib/types.ts`. Key fields:

```ts
id, title, description, tier, status, department, sdg, category,
points (number), duration (string), rewards, eventCode?, playerSlots?,
deadline? (ISO date), participants (number),
evidenceRequirements?, createdAt, updatedAt
```

### 4.4 Submissions (proof)

| Method | Path                             | Description                              | Auth    |
| ------ | -------------------------------- | ---------------------------------------- | ------- |
| GET    | `/submissions`                   | List submissions. Query: `status`         | Admin   |
| POST   | `/submissions`                   | Student submits proof (`SubmissionCreateInput`) | Student |
| POST   | `/submissions/:id/approve`       | Approve a submission                     | Admin   |
| POST   | `/submissions/:id/reject`        | Body: `{ "reason": "..." }`              | Admin   |

### 4.5 Problem board

| Method | Path         | Description                               | Auth |
| ------ | ------------ | ----------------------------------------- | ---- |
| GET    | `/problems`  | List problems with AI-generated quests    | Opt. |
| POST   | `/problems`  | Post a new problem (`ProblemCreateInput`) | Yes  |

On `POST /problems` your backend is expected to:
1. Persist the raw problem.
2. Call Claude (or your AI service) to break it into 3 `ProblemQuestBreakdown`
   entries (bronze / silver / gold).
3. Return the full `Problem` including `quests`.

### 4.6 Dashboards

| Method | Path                  | Returns            | Auth    |
| ------ | --------------------- | ------------------ | ------- |
| GET    | `/me/dashboard`       | `StudentDashboard` | Student |
| GET    | `/admin/dashboard`    | `AdminDashboard`   | Admin   |

### 4.7 Leaderboards

| Method | Path                       | Returns              | Auth    |
| ------ | -------------------------- | -------------------- | ------- |
| GET    | `/leaderboard/students`    | `StudentLeaderboard` | Opt.    |
| GET    | `/leaderboard/admin`       | `AdminLeaderboard`   | Admin   |

### 4.8 Innovation wall

| Method | Path                | Returns          |
| ------ | ------------------- | ---------------- |
| GET    | `/innovation-wall`  | `InnovationWall` |

Contains `ticker`, SDG `heatmap`, and `hottestQuests`.

---

## 5. Authorization rules

Implement a simple middleware that reads `Authorization: Bearer <token>`,
verifies it, and attaches `req.user = { id, role, department }`.

| Scope         | Required role | Example routes                                   |
| ------------- | ------------- | ------------------------------------------------ |
| Public        | none          | `GET /missions`, `GET /problems`, `GET /catalog` |
| Student only  | `student`     | `POST /submissions`, `GET /me/dashboard`         |
| Admin only    | `admin`       | Everything under `/admin/*`, mission mutations,  |
|               |               | submission approve/reject                        |

Return `401` for missing/invalid token, `403` for insufficient role.

---

## 6. File uploads (proof photos)

For MVP you can accept a `photoUrl` string (the frontend `submit-proof` form
already supports this). When you're ready for real uploads:

1. Add `POST /uploads` that accepts `multipart/form-data` with a single
   `file` field.
2. Store on S3 / local disk and return `{ "url": "..." }`.
3. The frontend will upload first, then include `photoUrl` in the
   `POST /submissions` body.

---

## 7. Environment variables

Frontend (`.env.local`):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

Backend (`backend/.env`):

```
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://...
JWT_SECRET=change-me
ANTHROPIC_API_KEY=...          # for the Claude problem-breakdown
```

---

## 8. Local dev workflow

1. `cp .env.example .env.local` (in the Next.js repo) and set
   `NEXT_PUBLIC_API_BASE_URL` to your Express server URL — **or leave it
   empty to keep using mock data**.
2. `npm run dev` on the frontend (port 3000).
3. `npm run dev` on the backend (port 4000).
4. Any call the backend doesn't yet implement will 404 → the frontend will
   log a warning and gracefully fall back to mock data in development. Once
   all endpoints are live, remove the `NODE_ENV !== "production"` fallback
   in `lib/api.ts` if you want strict failures.

---

## 9. Reference fixtures

Use `lib/mockData.ts` as canonical example payloads. Every exported
constant corresponds 1:1 to a backend response:

| Mock constant              | Endpoint                   |
| -------------------------- | -------------------------- |
| `mockCatalog`              | `GET /catalog`             |
| `mockMissions`             | `GET /missions`            |
| `mockSubmissions`          | `GET /submissions`         |
| `mockProblems`             | `GET /problems`            |
| `mockCurrentUser`          | `GET /auth/me`             |
| `mockStudentDashboard`     | `GET /me/dashboard`        |
| `mockAdminDashboard`       | `GET /admin/dashboard`     |
| `mockStudentLeaderboard`   | `GET /leaderboard/students`|
| `mockAdminLeaderboard`     | `GET /leaderboard/admin`   |
| `mockInnovationWall`       | `GET /innovation-wall`     |

If you match those payloads exactly, the UI will light up with no frontend
changes required.

---

## 10. Checklist for the backend dev

- [ ] Set up Express + TypeScript + CORS.
- [ ] Copy `lib/types.ts` and keep it in sync.
- [ ] Implement auth (`/auth/login`, `/auth/me`, `/auth/logout`) with JWT.
- [ ] Implement mission CRUD + filters.
- [ ] Implement submissions flow (create, approve, reject).
- [ ] Implement problem board + Claude breakdown on create.
- [ ] Implement dashboards + leaderboards + innovation wall.
- [ ] Optional: `/uploads` for proof photos.
- [ ] Verify every response shape against `lib/mockData.ts` (same field
      names, same enums, same types).
- [ ] Point the frontend at the backend by setting
      `NEXT_PUBLIC_API_BASE_URL`.

Happy questing! 🍄
