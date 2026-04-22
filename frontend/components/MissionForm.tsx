import Link from "next/link";

import { mockCatalog } from "@/lib/mockData";
import type { Catalog } from "@/lib/types";

export type MissionFormProps = {
  cancelHref: string;
  submitLabel?: string;
  heading?: string;
  catalog?: Catalog;
};

export function MissionForm({
  cancelHref,
  submitLabel = "▶ PUBLISH QUEST",
  heading = "QUEST DETAILS",
  catalog = mockCatalog,
}: MissionFormProps) {
  const tierOptions = catalog.tiers;
  const sdgOptions = catalog.sdgs;
  const categoryOptions = catalog.categories;
  const durationOptions = catalog.durations;

  return (
    <div className="panel">
      <h2>{heading}</h2>
      <form className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <div className="field col-span-full">
          <label htmlFor="mission-title">MISSION TITLE</label>
          <input id="mission-title" name="title" type="text" placeholder="e.g. Bring Your Own Tumbler" />
        </div>

        <div className="field">
          <label htmlFor="category">CATEGORY</label>
          <select id="category" name="category" defaultValue={categoryOptions[0]}>
            {categoryOptions.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="tier">TIER</label>
          <select id="tier" name="tier" defaultValue={tierOptions[1]?.value}>
            {tierOptions.map((tier) => (
              <option key={tier.value} value={tier.value}>
                {tier.label} (+{tier.points} pts)
              </option>
            ))}
          </select>
        </div>

        <div className="field col-span-full">
          <label htmlFor="goal">GOAL / DESCRIPTION</label>
          <textarea id="goal" name="description" placeholder="What must the player do to clear this quest?" />
        </div>

        <div className="field">
          <label htmlFor="duration">DURATION</label>
          <select id="duration" name="duration" defaultValue={durationOptions[1]}>
            {durationOptions.map((duration) => (
              <option key={duration}>{duration}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="sdg">SDG TAG</label>
          <select id="sdg" name="sdg" defaultValue={sdgOptions[2]}>
            {sdgOptions.map((sdg) => (
              <option key={sdg}>{sdg}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="points">POINT VALUE</label>
          <input id="points" name="points" type="number" defaultValue={50} min={1} max={1000} />
        </div>

        <div className="field">
          <label htmlFor="event-code">EVENT CODE (CONTEST ONLY)</label>
          <input id="event-code" name="eventCode" type="text" placeholder="e.g. HACK2026" />
        </div>

        <div className="field col-span-full">
          <label htmlFor="evidence">EVIDENCE REQUIREMENTS</label>
          <textarea id="evidence" name="evidenceRequirements" placeholder="e.g. 1 photo per day, signed attendance sheet, 200-word reflection" />
        </div>

        <div className="field col-span-full">
          <label htmlFor="rewards">🎁 REWARDS / PRIZE POOL</label>
          <textarea
            id="rewards"
            name="rewards"
            placeholder="e.g. Top 3 win Jollibee GC + Certificate · All clearers get a digital badge"
          />
        </div>

        <div className="field">
          <label htmlFor="slots">PLAYER SLOTS</label>
          <input id="slots" name="playerSlots" type="number" defaultValue={50} min={1} max={9999} />
        </div>

        <div className="field">
          <label htmlFor="deadline">DEADLINE</label>
          <input id="deadline" name="deadline" type="date" />
        </div>

        <div className="col-span-full flex gap-3.5 justify-end mt-2.5">
          <Link href={cancelHref} className="pixel-btn">
            CANCEL
          </Link>
          <button type="submit" className="pixel-btn pixel-btn-green">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
