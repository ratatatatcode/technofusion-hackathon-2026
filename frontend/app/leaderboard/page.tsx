import { SubpageShell } from "@/components/SubpageShell";
import { getStudentLeaderboard } from "@/lib/api";

function rankClass(rank: number): string {
  if (rank === 1) return "rank-1";
  if (rank === 2) return "rank-2";
  if (rank === 3) return "rank-3";
  return "";
}

export default async function LeaderboardPage() {
  const board = await getStudentLeaderboard();

  return (
    <SubpageShell
      title="🏆 LEADERBOARD"
      subtitle={`${board.season} · ${board.daysRemaining} days remaining`}
      ctaHref="/dashboard"
      ctaLabel="← BACK"
      ctaClass="pixel-btn pixel-btn-blue"
    >
      <div className="flex">
        <span className="tab active">👤 INDIVIDUAL</span>
        <span className="tab">🏛 DEPARTMENT</span>
      </div>

      <table className="lb-table">
        <thead>
          <tr>
            <th>RANK</th>
            <th>PLAYER</th>
            <th>DEPT</th>
            <th>QUESTS</th>
            <th>COINS</th>
          </tr>
        </thead>
        <tbody>
          {board.individuals.map((player) => (
            <tr key={player.playerId}>
              <td className={`rank ${rankClass(player.rank)}`}>#{player.rank}</td>
              <td>{player.playerName}</td>
              <td>{player.department}</td>
              <td>{player.quests}</td>
              <td>{player.coins.toLocaleString()}</td>
            </tr>
          ))}
          <tr>
            <td
              colSpan={5}
              style={{
                textAlign: "center",
                padding: 8,
                background: "#eee",
                fontFamily: "var(--font-display)",
                fontSize: 10,
              }}
            >
              . . .
            </td>
          </tr>
          {board.nearbyPlayers.map((player) => (
            <tr key={player.playerId} className={player.isCurrentUser ? "me" : undefined}>
              <td className="rank">#{player.rank}</td>
              <td>{player.playerName}</td>
              <td>{player.department}</td>
              <td>{player.quests}</td>
              <td>{player.coins.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="panel" style={{ marginTop: 30 }}>
        <h2>📊 YOUR RELATIVE RANK</h2>
        <p style={{ fontSize: 20 }}>
          You&apos;re in the <b>top {100 - board.currentUserPercentile}%</b> of all players this season.
        </p>
        <div className="progress-meter">
          <div
            className="progress-meter-fill"
            style={{ width: `${board.currentUserPercentile}%` }}
          />
          <span className="progress-meter-label">{board.currentUserPercentile}% PERCENTILE</span>
        </div>
      </div>

      <div className="panel">
        <h2>🏛 TOP DEPARTMENTS</h2>
        <table className="lb-table">
          <thead>
            <tr>
              <th>RANK</th>
              <th>DEPARTMENT</th>
              <th>PLAYERS</th>
              <th>TOTAL COINS</th>
            </tr>
          </thead>
          <tbody>
            {board.departments.map((dept) => (
              <tr key={dept.rank}>
                <td className={`rank ${rankClass(dept.rank)}`}>#{dept.rank}</td>
                <td>{dept.name}</td>
                <td>{dept.players}</td>
                <td>{dept.totalCoins.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SubpageShell>
  );
}
