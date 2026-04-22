"use client";

import { useEffect, useState } from "react";

import { SubpageShell } from "@/components/SubpageShell";
import { getAdminLeaderboard, getStudentLeaderboard } from "@/lib/api";
import { mockAdminLeaderboard, mockStudentLeaderboard } from "@/lib/mockData";
import type { AdminLeaderboard, StudentLeaderboard } from "@/lib/types";

type View = "admin" | "student";

function rankClass(rank: number): string {
  if (rank === 1) return "rank-1";
  if (rank === 2) return "rank-2";
  if (rank === 3) return "rank-3";
  return "";
}

export default function AdminLeaderboardPage() {
  const [view, setView] = useState<View>("admin");
  const [adminBoard, setAdminBoard] = useState<AdminLeaderboard>(mockAdminLeaderboard);
  const [studentBoard, setStudentBoard] = useState<StudentLeaderboard>(mockStudentLeaderboard);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAdminLeaderboard(), getStudentLeaderboard()]).then(([admin, student]) => {
      if (cancelled) return;
      setAdminBoard(admin);
      setStudentBoard(student);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SubpageShell
      variant="admin"
      title="🏆 ADMIN LEADERBOARD"
      subtitle={
        view === "admin"
          ? "Review campus performance, department standings, and moderator activity."
          : "Preview: this is the leaderboard students see on their side."
      }
      ctaHref="/admin"
      ctaLabel="← BACK"
      ctaClass="pixel-btn pixel-btn-blue"
    >
      <div className="flex" role="tablist" aria-label="Leaderboard view">
        <button
          type="button"
          className={`tab ${view === "admin" ? "active" : ""}`}
          onClick={() => setView("admin")}
          aria-selected={view === "admin"}
          role="tab"
        >
          🛡 ADMIN VIEW
        </button>
        <button
          type="button"
          className={`tab ${view === "student" ? "active" : ""}`}
          onClick={() => setView("student")}
          aria-selected={view === "student"}
          role="tab"
        >
          👤 STUDENT VIEW
        </button>
      </div>

      {view === "admin" ? (
        <>
          <div className="panel">
            <h2>📊 MODERATION SNAPSHOT</h2>
            <p style={{ fontSize: 20 }}>
              This week admins verified <b>{adminBoard.moderationSnapshot.proofsVerified} proofs</b>,
              rejected <b>{adminBoard.moderationSnapshot.proofsRejected}</b>, and published{" "}
              <b>{adminBoard.moderationSnapshot.missionsPublished}</b> new missions.
            </p>
          </div>

          <div className="panel">
            <h2>🛡 TOP MODERATORS</h2>
            <table className="lb-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>ADMIN</th>
                  <th>MISSIONS POSTED</th>
                  <th>PROOFS VERIFIED</th>
                </tr>
              </thead>
              <tbody>
                {adminBoard.topModerators.map((moderator) => (
                  <tr key={moderator.rank}>
                    <td className={`rank ${rankClass(moderator.rank)}`}>#{moderator.rank}</td>
                    <td>{moderator.name}</td>
                    <td>{moderator.missionsPosted}</td>
                    <td>{moderator.proofsVerified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h2>🏛 DEPARTMENT STANDINGS</h2>
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
                {adminBoard.departments.map((dept) => (
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
        </>
      ) : (
        <>
          <div className="panel" style={{ marginTop: 0 }}>
            <h2>👤 TOP PLAYERS ({studentBoard.season})</h2>
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
                {studentBoard.individuals.map((player) => (
                  <tr key={player.playerId}>
                    <td className={`rank ${rankClass(player.rank)}`}>#{player.rank}</td>
                    <td>{player.playerName}</td>
                    <td>{player.department}</td>
                    <td>{player.quests}</td>
                    <td>{player.coins.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                {studentBoard.departments.map((dept) => (
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
        </>
      )}
    </SubpageShell>
  );
}
