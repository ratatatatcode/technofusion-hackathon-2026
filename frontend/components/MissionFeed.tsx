"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Mission, MissionTier } from "@/lib/types";

type MissionFeedProps = {
  missions: Mission[];
  departments?: readonly string[];
  tiers?: readonly MissionTier[];
};

const defaultDepartments = ["CAFAD", "CET", "CICS", "COE"] as const;
const defaultTiers: readonly MissionTier[] = ["bronze", "silver", "gold", "contest"];

export function MissionFeed({
  missions,
  departments = defaultDepartments,
  tiers = defaultTiers,
}: MissionFeedProps) {
  const [department, setDepartment] = useState<string | null>(null);
  const [tier, setTier] = useState<MissionTier | null>(null);

  const filtered = useMemo(
    () =>
      missions.filter(
        (mission) =>
          (!department || mission.department === department) &&
          (!tier || mission.tier === tier)
      ),
    [missions, department, tier]
  );

  const reset = () => {
    setDepartment(null);
    setTier(null);
  };

  const hasActiveFilter = Boolean(department || tier);

  return (
    <>
      <div className="filters">
        <button type="button" onClick={() => setDepartment(null)} className={`filter-chip ${!department ? "active" : ""}`}>ALL COLLEGES</button>
        {departments.map((dept) => (
          <button key={dept} type="button" onClick={() => setDepartment(dept)} className={`filter-chip ${department === dept ? "active" : ""}`}>{dept}</button>
        ))}
        <span className="spacer-pipe" />
        <button type="button" onClick={() => setTier(null)} className={`filter-chip ${!tier ? "active" : ""}`}>ALL TIERS</button>
        {tiers.map((tierOption) => (
          <button key={tierOption} type="button" onClick={() => setTier(tierOption)} className={`filter-chip ${tier === tierOption ? "active" : ""}`}>{tierOption.toUpperCase()}</button>
        ))}
        {hasActiveFilter && (
          <>
            <span className="spacer-pipe" />
            <button type="button" onClick={reset} className="filter-chip clear-chip">✕ CLEAR</button>
          </>
        )}
      </div>

      <div className="filter-summary">
        Showing <b>{filtered.length}</b> of <b>{missions.length}</b> quests
        {hasActiveFilter ? " · filtered by " : ""}
        {department && <span className="tag-pill">{department}</span>}
        {tier && <span className="tag-pill">{tier.toUpperCase()}</span>}
      </div>

      <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] max-[900px]:grid-cols-1">
        {filtered.map((mission) => (
          <div className="mission-card" key={mission.id}>
            <div className="top">
              <span className={`tier-badge ${mission.tier}`}>{mission.tier}</span>
              <span className="sdg-badge">{mission.sdg}</span>
            </div>
            <h3>{mission.title}</h3>
            <p>{mission.description}</p>
            <div className="mission-meta">
              <span className="pts">+{mission.points} PTS</span>
              <span className="duration">{mission.duration}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 10 }}>🕳️</div>
            <h3>NO QUESTS MATCH</h3>
            <p>Try clearing some filters to see more quests.</p>
            <button type="button" onClick={reset} className="pixel-btn pixel-btn-yellow">↻ CLEAR FILTERS</button>
          </div>
        )}
      </div>

      <div className="flex gap-3.5 justify-end mt-2.5">
        <Link href="/submit-proof" className="pixel-btn pixel-btn-green">▶ SUBMIT PROOF</Link>
      </div>
    </>
  );
}
