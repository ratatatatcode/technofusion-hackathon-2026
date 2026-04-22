"use client";

import { useEffect, useState } from "react";

const tips = [
  "Howdy! I'm QUESTER QUINN — your campus quest guide!",
  "📜 ADMINS post missions with rewards, tiers, and SDG tags.",
  "🎯 STUDENTS pick quests from the MISSION FEED — bronze to contest tier!",
  "📸 Done with a quest? Hit SUBMIT PROOF — upload a pic + summary.",
  "✔️ Admins approve proof in the VERIFY QUEUE — keeps the realm fair.",
  "🪙 Track your coins, streaks, badges in your DASHBOARD.",
  "🏆 Climb the LEADERBOARD by department or solo!",
  "⭐ The INNOVATION WALL shows live SDG progress as a heat map.",
  "💡 Got a campus problem? Post on PROBLEM BOARD — Claude AI splits it into quests.",
  "▶ Press PLAY NOW to start your first quest, hero!",
];

export function MascotGuide() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % tips.length);
    }, 6000);
    return () => clearInterval(id);
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        className="mascot-toggle"
        onClick={() => setOpen(true)}
        aria-label="Show guide"
      >
        🎩
      </button>
    );
  }

  return (
    <div className="mascot-guide" role="status" aria-live="polite">
      <button
        type="button"
        className="mascot-close"
        onClick={() => setOpen(false)}
        aria-label="Close guide"
      >
        ×
      </button>

      <div className="mascot-bubble">
        <p key={index}>{tips[index]}</p>
        <div className="mascot-dots">
          {tips.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`mascot-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Tip ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mascot-character" aria-hidden="true">
        {/* Safari/explorer hat */}
        <div className="m-hat-brim" />
        <div className="m-hat-top" />
        <div className="m-hat-band" />
        <div className="m-hat-feather" />
        {/* Face */}
        <div className="m-face">
          <div className="m-eye left" />
          <div className="m-eye right" />
          <div className="m-cheek left" />
          <div className="m-cheek right" />
          <div className="m-mouth" />
        </div>
        {/* Scarf */}
        <div className="m-scarf" />
        {/* Body — green explorer vest */}
        <div className="m-body" />
        <div className="m-belt" />
        <div className="m-buckle" />
        {/* Arms */}
        <div className="m-arm left" />
        <div className="m-arm right" />
        {/* Boots */}
        <div className="m-feet">
          <span /> <span />
        </div>
      </div>
    </div>
  );
}
