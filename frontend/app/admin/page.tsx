import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { SubpageShell } from "@/components/SubpageShell";
import { getAdminDashboard } from "@/lib/api";

const statusColor: Record<"approved" | "pending" | "rejected", string> = {
  approved: "var(--luigi-green)",
  pending: "#b56a00",
  rejected: "var(--mario-red)",
};

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboard();

  return (
    <SubpageShell
      variant="admin"
      title="👑 ADMIN CONSOLE"
      subtitle="Post quests · set rewards · verify proof"
      ctaHref="/admin/missions/new"
      ctaLabel="+ POST MISSION"
      ctaClass="pixel-btn pixel-btn-green"
    >
      <div className="grid grid-cols-3 gap-6 mb-6 max-[900px]:grid-cols-1">
        <StatCard icon="🎯" value={dashboard.stats.liveMissions} label="LIVE MISSIONS" tone="success" />
        <StatCard icon="📥" value={dashboard.stats.pendingVerify} label="PENDING VERIFY" tone="danger" />
        <StatCard icon="🍄" value={dashboard.stats.activeStudents.toLocaleString()} label="ACTIVE STUDENTS" tone="coin" />
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6 mb-6 max-[900px]:grid-cols-1">
        <div className="panel">
          <h2>📥 RECENT SUBMISSIONS</h2>
          <ul className="history-list">
            {dashboard.recentSubmissions.map((submission) => (
              <li key={submission.id}>
                <span>{submission.label}</span>
                <span className="pts" style={{ color: statusColor[submission.status] }}>
                  {submission.status.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3.5 justify-end mt-4">
            <Link href="/admin/verify-queue" className="pixel-btn pixel-btn-blue">
              → OPEN VERIFY QUEUE
            </Link>
          </div>
        </div>

        <div className="panel">
          <h2>⚡ QUICK ACTIONS</h2>
          <div className="quick-actions">
            <Link href="/admin/missions/new" className="pixel-btn pixel-btn-green big">
              + NEW MISSION
            </Link>
            <Link href="/admin/missions" className="pixel-btn pixel-btn-yellow big">
              📋 MANAGE MISSIONS
            </Link>
            <Link href="/admin/verify-queue" className="pixel-btn pixel-btn-red big">
              ✅ VERIFY PROOF
            </Link>
            <Link href="/admin/leaderboard" className="pixel-btn pixel-btn-blue big">
              🏆 LEADERBOARD
            </Link>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>🎯 LIVE MISSIONS</h2>
        <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] max-[900px]:grid-cols-1">
          {dashboard.liveMissions.map((mission) => (
            <div className="mission-card" key={mission.id}>
              <div className="top">
                <span className={`tier-badge ${mission.tier}`}>{mission.tier}</span>
                <span className="sdg-badge">LIVE</span>
              </div>
              <h3>{mission.title}</h3>
              <p>{mission.meta}</p>
              <div className="mission-meta">
                <Link href="/admin/missions" className="pixel-btn pixel-btn-blue">EDIT</Link>
                <Link href="/admin/verify-queue" className="pixel-btn">VIEW PROOF</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SubpageShell>
  );
}
