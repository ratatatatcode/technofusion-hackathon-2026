export type NavItem = { href: string; label: string };

export const studentNavItems: readonly NavItem[] = [
  { href: "/missions", label: "MISSIONS" },
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/problem-board", label: "PROBLEM BOARD" },
  { href: "/leaderboard", label: "LEADERBOARD" },
  { href: "/innovation-wall", label: "INNOVATION WALL" },
];

export const adminNavItems: readonly NavItem[] = [
  { href: "/admin", label: "OVERVIEW" },
  { href: "/admin/missions", label: "MISSIONS" },
  { href: "/admin/missions/new", label: "+ POST MISSION" },
  { href: "/admin/problem-board", label: "PROBLEM BOARD" },
  { href: "/admin/verify-queue", label: "VERIFY QUEUE" },
  { href: "/admin/leaderboard", label: "LEADERBOARD" },
];

// Backwards-compat
export const navItems = studentNavItems;
