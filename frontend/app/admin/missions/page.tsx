import { AdminMissionRow } from "@/components/AdminMissionRow";
import { SubpageShell } from "@/components/SubpageShell";
import { getMissions } from "@/lib/api";

export default async function AdminMissionsPage() {
  const missions = await getMissions();

  return (
    <SubpageShell
      variant="admin"
      title="📋 MANAGE MISSIONS"
      subtitle="All quests posted by your console"
      ctaHref="/admin/missions/new"
      ctaLabel="+ POST MISSION"
      ctaClass="pixel-btn pixel-btn-green"
    >
      <div className="panel">
        <h2>YOUR QUEST LIBRARY</h2>
        <div className="admin-mission-list">
          {missions.map((mission) => (
            <AdminMissionRow
              key={mission.id}
              title={mission.title}
              tier={mission.tier}
              sdg={mission.sdg}
              status={mission.status}
              participants={mission.participants}
              rewards={mission.rewards}
            />
          ))}
        </div>
      </div>
    </SubpageShell>
  );
}
