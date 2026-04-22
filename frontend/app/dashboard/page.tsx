import { SubpageShell } from "@/components/SubpageShell";
import { getStudentDashboard } from "@/lib/api";

export default async function DashboardPage() {
  const dashboard = await getStudentDashboard();
  const { user, history, activeMissions } = dashboard;

  return (
    <SubpageShell
      title={`🍄 PLAYER 1 — ${user.name.toUpperCase()}`}
      subtitle={`${user.department}${user.year ? ` · ${user.year}` : ""} · Member since World 1-1`}
      ctaHref="/submit-proof"
      ctaLabel="+ SUBMIT PROOF"
      ctaClass="pixel-btn pixel-btn-green"
    >
      <div className="grid grid-cols-3 gap-6 mb-6 max-[900px]:grid-cols-1">
        <div className="stat-card">
          <div style={{ fontSize: 36 }}>🪙</div>
          <div className="stat-num">{user.totalCoins.toLocaleString()}</div>
          <div className="stat-label">TOTAL COINS</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 36 }}>🏆</div>
          <div className="stat-num">#{user.currentRank}</div>
          <div className="stat-label">CURRENT RANK</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 36 }}>⚡</div>
          <div className="stat-num">{user.questStreak}</div>
          <div className="stat-label">QUEST STREAK</div>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6 mb-6 max-[900px]:grid-cols-1">
        <div className="panel">
          <h2>📜 MISSION HISTORY (LAST 5)</h2>
          <ul className="history-list">
            {history.map((entry) => (
              <li key={entry.id}>
                <span>{entry.label}</span>
                <span
                  className="pts"
                  style={entry.status === "pending" ? { color: "#888" } : undefined}
                >
                  {entry.status === "pending" ? "PENDING" : `+${entry.points} PTS`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h2>🎖 BADGES</h2>
          <div className="flex flex-wrap gap-3.5">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className={`badge${badge.unlocked ? "" : " locked"}`}
                title={badge.label}
              >
                {badge.icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>⭐ ACTIVE QUESTS</h2>
        <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] max-[900px]:grid-cols-1">
          {activeMissions.map((mission) => (
            <div className="mission-card" key={mission.id}>
              <div className="top">
                <span className={`tier-badge ${mission.tier}`}>{mission.tier}</span>
                <span className="sdg-badge">{mission.sdg}</span>
              </div>
              <h3>{mission.title}</h3>
              <p>{mission.description}</p>
              <div className="mission-meta">
                <span className="pts">+{mission.points} PTS</span>
                <span className="duration">{mission.timeLeft}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SubpageShell>
  );
}
