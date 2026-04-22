import { SubpageShell } from "@/components/SubpageShell";
import { getInnovationWall } from "@/lib/api";

export default async function InnovationWallPage() {
  const wall = await getInnovationWall();
  const doubledTicker = [...wall.ticker, ...wall.ticker];

  return (
    <SubpageShell
      title="⭐ INNOVATION WALL"
      subtitle="The realm in real-time."
      ctaHref="/dashboard"
      ctaLabel="← BACK"
      ctaClass="pixel-btn pixel-btn-blue"
    >
      <div className="ticker">
        <div className="ticker-track">
          {doubledTicker.map((entry, index) => (
            <span className="ticker-item" key={`${entry.id}-${index}`}>
              {entry.text}
            </span>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>🌍 SDG HEAT MAP — BRIGHTNESS = COMPLETION COUNT</h2>
        <p className="text-[18px] mb-[18px]">
          17 tiles. The brighter it glows, the more your campus has done for that goal.
        </p>
        <div className="grid grid-cols-6 gap-3 max-[900px]:grid-cols-4 max-[500px]:grid-cols-3">
          {wall.heatmap.map((tile) => (
            <div
              className={`sdg-tile sdg-${tile.number}`}
              style={{ opacity: tile.intensity }}
              key={tile.number}
            >
              <div className="num">{tile.number}</div>
              {tile.label}
              <span className="count">{tile.completionCount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>🔥 HOTTEST QUESTS THIS WEEK</h2>
        <ul className="history-list">
          {wall.hottestQuests.map((quest) => (
            <li key={quest.id}>
              <span>{quest.label}</span>
              <span className="pts">{quest.players} PLAYERS</span>
            </li>
          ))}
        </ul>
      </div>
    </SubpageShell>
  );
}
