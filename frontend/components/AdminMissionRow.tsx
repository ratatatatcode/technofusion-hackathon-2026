import type { MissionStatus, MissionTier } from "@/lib/types";

type AdminMissionRowProps = {
  title: string;
  tier: MissionTier;
  sdg: string;
  status: MissionStatus;
  participants: number;
  rewards: string;
};

const statusBg: Record<MissionStatus, string> = {
  live: "var(--luigi-green)",
  draft: "#888",
  ended: "var(--mario-red)",
};

export function AdminMissionRow({
  title,
  tier,
  sdg,
  status,
  participants,
  rewards,
}: AdminMissionRowProps) {
  return (
    <div className="admin-mission-row">
      <div className="amr-main">
        <div className="flex gap-2 flex-wrap mb-2.5">
          <span className={`tier-badge ${tier}`}>{tier}</span>
          <span className="sdg-badge">{sdg}</span>
          <span
            className="tier-badge"
            style={{ background: statusBg[status], color: "#fff" }}
          >
            {status.toUpperCase()}
          </span>
        </div>
        <h3>{title}</h3>
        <p className="amr-rewards">🎁 {rewards}</p>
      </div>
      <div className="amr-side">
        <div className="amr-count">{participants}</div>
        <div className="amr-count-label">PLAYERS</div>
        <div className="flex gap-2 mt-1.5">
          <button type="button" className="pixel-btn pixel-btn-blue">EDIT</button>
          <button type="button" className="pixel-btn pixel-btn-red">END</button>
        </div>
      </div>
    </div>
  );
}
