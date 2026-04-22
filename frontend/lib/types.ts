// ---------------------------------------------------------------------------
// Shared domain types. These shapes are the contract between the Next.js
// frontend and the Express backend. Keys use camelCase. Enumerations use
// lower-case kebab-free strings so they map cleanly to URL params.
// ---------------------------------------------------------------------------

export type MissionTier = "bronze" | "silver" | "gold" | "contest";
export type MissionStatus = "live" | "draft" | "ended";
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type UserRole = "student" | "admin";
export type ProblemAuthorRole = "student" | "faculty" | "staff";

// ---- Mission ---------------------------------------------------------------

export type Mission = {
  id: string;
  title: string;
  description: string;
  tier: MissionTier;
  status: MissionStatus;
  department: string;      // "CCS", "COE", etc.
  sdg: string;             // "SDG 13"
  category: string;        // "Sustainability", etc.
  points: number;          // numeric coin value
  duration: string;        // human readable, e.g. "1 week"
  rewards: string;         // free-form prize description
  eventCode?: string | null;
  playerSlots?: number | null;
  deadline?: string | null; // ISO date
  participants: number;
  evidenceRequirements?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MissionCreateInput = Omit<
  Mission,
  "id" | "participants" | "createdAt" | "updatedAt" | "status"
> & {
  status?: MissionStatus;
};

export type MissionUpdateInput = Partial<MissionCreateInput>;

// ---- Submission (proof) ----------------------------------------------------

export type Submission = {
  id: string;
  missionId: string;
  missionTitle: string;
  missionTier: MissionTier;
  playerId: string;
  playerName: string;
  playerDepartment: string;
  playerYear: string;
  summary: string;
  photoUrl?: string | null;
  linkUrl?: string | null;
  eventCode?: string | null;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
};

export type SubmissionCreateInput = {
  missionId: string;
  summary: string;
  photoUrl?: string | null;
  linkUrl?: string | null;
  eventCode?: string | null;
};

// ---- Problem board ---------------------------------------------------------

export type ProblemQuestBreakdown = {
  tier: MissionTier;
  text: string;
  points: number;
};

export type Problem = {
  id: string;
  title: string;
  description: string;
  location: string;
  postedByRole: ProblemAuthorRole;
  postedByName: string;
  upvotes: number;
  createdAt: string;
  quests: ProblemQuestBreakdown[];
};

export type ProblemCreateInput = {
  description: string;
  location: string;
  postedByRole: ProblemAuthorRole;
};

// ---- Users / auth ----------------------------------------------------------

export type User = {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  year?: string | null;
  totalCoins: number;
  currentRank: number;
  questStreak: number;
  badges: Badge[];
};

export type Badge = {
  id: string;
  label: string;
  icon: string;
  unlocked: boolean;
};

export type LoginInput = {
  schoolId: string;
  password: string;
  role: UserRole;
};

export type LoginResponse = {
  token: string;
  user: User;
};

// ---- Dashboard -------------------------------------------------------------

export type MissionHistoryItem = {
  id: string;
  label: string;
  points: number | null;    // null = pending
  status: "approved" | "pending";
};

export type ActiveMissionCard = {
  id: string;
  tier: MissionTier;
  sdg: string;
  title: string;
  description: string;
  points: number;
  timeLeft: string;
};

export type StudentDashboard = {
  user: User;
  history: MissionHistoryItem[];
  activeMissions: ActiveMissionCard[];
};

export type AdminDashboard = {
  stats: {
    liveMissions: number;
    pendingVerify: number;
    activeStudents: number;
  };
  recentSubmissions: Array<{
    id: string;
    label: string;
    status: "approved" | "pending" | "rejected";
  }>;
  liveMissions: Array<{
    id: string;
    tier: MissionTier;
    title: string;
    meta: string;
  }>;
};

// ---- Leaderboard -----------------------------------------------------------

export type LeaderboardPlayer = {
  rank: number;
  playerId: string;
  playerName: string;
  department: string;
  quests: number;
  coins: number;
  isCurrentUser?: boolean;
};

export type LeaderboardDepartment = {
  rank: number;
  name: string;
  players: number;
  totalCoins: number;
};

export type LeaderboardModerator = {
  rank: number;
  name: string;
  missionsPosted: number;
  proofsVerified: number;
};

export type StudentLeaderboard = {
  season: string;
  daysRemaining: number;
  individuals: LeaderboardPlayer[];
  departments: LeaderboardDepartment[];
  currentUserPercentile: number;
  nearbyPlayers: LeaderboardPlayer[];
};

export type AdminLeaderboard = {
  moderationSnapshot: {
    proofsVerified: number;
    proofsRejected: number;
    missionsPublished: number;
  };
  topModerators: LeaderboardModerator[];
  departments: LeaderboardDepartment[];
};

// ---- Innovation wall -------------------------------------------------------

export type TickerEntry = {
  id: string;
  text: string;
};

export type SdgHeatmapTile = {
  number: number;
  label: string;
  completionCount: number;
  intensity: number; // 0..1 visual brightness
};

export type HotQuest = {
  id: string;
  label: string;
  players: number;
};

export type InnovationWall = {
  ticker: TickerEntry[];
  heatmap: SdgHeatmapTile[];
  hottestQuests: HotQuest[];
};

// ---- Catalog (dropdown option lists served by the API) ---------------------

export type Catalog = {
  departments: string[];
  tiers: Array<{ value: MissionTier; label: string; points: number }>;
  sdgs: string[];
  categories: string[];
  durations: string[];
};
