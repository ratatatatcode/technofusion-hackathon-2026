"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { createMission, updateMission } from "@/lib/api";
import { mockCatalog } from "@/lib/mockData";
import type { Catalog, Mission, MissionCreateInput, MissionStatus, MissionUpdateInput } from "@/lib/types";

export type MissionFormProps = {
  cancelHref: string;
  mission?: Mission;
  missionId?: string;
  mode?: "create" | "edit";
  successHref?: string;
  submitLabel?: string;
  heading?: string;
  catalog?: Catalog;
};

export function MissionForm({
  cancelHref,
  mission,
  missionId,
  mode = "create",
  successHref,
  submitLabel = "▶ PUBLISH QUEST",
  heading = "QUEST DETAILS",
  catalog = mockCatalog,
}: MissionFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tierOptions = catalog.tiers;
  const sdgOptions = catalog.sdgs;
  const categoryOptions = catalog.categories;
  const durationOptions = catalog.durations;
  const departmentOptions = catalog.departments;
  const isEditMode = mode === "edit";

  const safeDefaults = useMemo(
    () => ({
      department: mission?.department ?? departmentOptions[0] ?? "CCS",
      title: mission?.title ?? "",
      category: mission?.category ?? categoryOptions[0] ?? "Sustainability",
      tier: mission?.tier ?? tierOptions[1]?.value ?? "silver",
      description: mission?.description ?? "",
      duration: mission?.duration ?? durationOptions[1] ?? "1 week",
      sdg: mission?.sdg ?? sdgOptions[2] ?? "SDG 4",
      points: mission?.points ?? 50,
      eventCode: mission?.eventCode ?? "",
      evidenceRequirements: mission?.evidenceRequirements ?? "",
      rewards: mission?.rewards ?? "",
      playerSlots: mission?.playerSlots ?? 50,
      deadline: mission?.deadline ? mission.deadline.slice(0, 10) : "",
      status: mission?.status ?? "draft",
    }),
    [
      mission,
      departmentOptions,
      categoryOptions,
      tierOptions,
      durationOptions,
      sdgOptions,
    ]
  );

  const targetHref = successHref ?? cancelHref;

  const parsePositiveInt = (value: FormDataEntryValue | null, fallback: number): number => {
    if (typeof value !== "string") return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const normalizeText = (value: FormDataEntryValue | null): string =>
    typeof value === "string" ? value.trim() : "";

  const normalizeOptionalText = (value: FormDataEntryValue | null): string | null => {
    const normalized = normalizeText(value);
    return normalized === "" ? null : normalized;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      if (isEditMode) {
        const resolvedMissionId = missionId ?? mission?.id;
        if (!resolvedMissionId) {
          throw new Error("Mission ID is missing for edit mode.");
        }

        const patch: MissionUpdateInput = {
          department: normalizeText(formData.get("department")),
          title: normalizeText(formData.get("title")),
          category: normalizeText(formData.get("category")),
          tier: normalizeText(formData.get("tier")) as Mission["tier"],
          description: normalizeText(formData.get("description")),
          duration: normalizeText(formData.get("duration")),
          sdg: normalizeText(formData.get("sdg")),
          points: parsePositiveInt(formData.get("points"), safeDefaults.points),
          eventCode: normalizeOptionalText(formData.get("eventCode")),
          evidenceRequirements: normalizeOptionalText(formData.get("evidenceRequirements")),
          rewards: normalizeText(formData.get("rewards")),
          playerSlots: parsePositiveInt(formData.get("playerSlots"), safeDefaults.playerSlots),
          deadline: normalizeOptionalText(formData.get("deadline")),
          status: normalizeText(formData.get("status")) as MissionStatus,
        };

        await updateMission(resolvedMissionId, patch);
      } else {
        const input: MissionCreateInput = {
          department: normalizeText(formData.get("department")),
          title: normalizeText(formData.get("title")),
          category: normalizeText(formData.get("category")),
          tier: normalizeText(formData.get("tier")) as Mission["tier"],
          description: normalizeText(formData.get("description")),
          duration: normalizeText(formData.get("duration")),
          sdg: normalizeText(formData.get("sdg")),
          points: parsePositiveInt(formData.get("points"), safeDefaults.points),
          eventCode: normalizeOptionalText(formData.get("eventCode")),
          evidenceRequirements: normalizeOptionalText(formData.get("evidenceRequirements")),
          rewards: normalizeText(formData.get("rewards")),
          playerSlots: parsePositiveInt(formData.get("playerSlots"), safeDefaults.playerSlots),
          deadline: normalizeOptionalText(formData.get("deadline")),
        };

        await createMission(input);
      }

      router.push(targetHref);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save mission right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="panel">
      <h2>{heading}</h2>
      {errorMessage && (
        <p style={{ color: "#ffd4d4", background: "#8b3000", padding: "8px 10px", marginBottom: 16 }}>
          {errorMessage}
        </p>
      )}
      <form className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="department">DEPARTMENT</label>
          <select id="department" name="department" defaultValue={safeDefaults.department}>
            {departmentOptions.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </select>
        </div>

        <div className="field col-span-full">
          <label htmlFor="mission-title">MISSION TITLE</label>
          <input
            id="mission-title"
            name="title"
            type="text"
            placeholder="e.g. Bring Your Own Tumbler"
            defaultValue={safeDefaults.title}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="category">CATEGORY</label>
          <select id="category" name="category" defaultValue={safeDefaults.category}>
            {categoryOptions.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="tier">TIER</label>
          <select id="tier" name="tier" defaultValue={safeDefaults.tier}>
            {tierOptions.map((tier) => (
              <option key={tier.value} value={tier.value}>
                {tier.label} (+{tier.points} pts)
              </option>
            ))}
          </select>
        </div>

        <div className="field col-span-full">
          <label htmlFor="goal">GOAL / DESCRIPTION</label>
          <textarea
            id="goal"
            name="description"
            placeholder="What must the player do to clear this quest?"
            defaultValue={safeDefaults.description}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="duration">DURATION</label>
          <select id="duration" name="duration" defaultValue={safeDefaults.duration}>
            {durationOptions.map((duration) => (
              <option key={duration}>{duration}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="sdg">SDG TAG</label>
          <select id="sdg" name="sdg" defaultValue={safeDefaults.sdg}>
            {sdgOptions.map((sdg) => (
              <option key={sdg}>{sdg}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="points">POINT VALUE</label>
          <input id="points" name="points" type="number" defaultValue={safeDefaults.points} min={1} max={1000} required />
        </div>

        <div className="field">
          <label htmlFor="event-code">EVENT CODE (CONTEST ONLY)</label>
          <input id="event-code" name="eventCode" type="text" placeholder="e.g. HACK2026" defaultValue={safeDefaults.eventCode} />
        </div>

        <div className="field col-span-full">
          <label htmlFor="evidence">EVIDENCE REQUIREMENTS</label>
          <textarea
            id="evidence"
            name="evidenceRequirements"
            placeholder="e.g. 1 photo per day, signed attendance sheet, 200-word reflection"
            defaultValue={safeDefaults.evidenceRequirements}
          />
        </div>

        <div className="field col-span-full">
          <label htmlFor="rewards">🎁 REWARDS / PRIZE POOL</label>
          <textarea
            id="rewards"
            name="rewards"
            placeholder="e.g. Top 3 win Jollibee GC + Certificate · All clearers get a digital badge"
            defaultValue={safeDefaults.rewards}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="slots">PLAYER SLOTS</label>
          <input id="slots" name="playerSlots" type="number" defaultValue={safeDefaults.playerSlots} min={1} max={9999} required />
        </div>

        <div className="field">
          <label htmlFor="deadline">DEADLINE</label>
          <input id="deadline" name="deadline" type="date" defaultValue={safeDefaults.deadline} />
        </div>

        {isEditMode && (
          <div className="field">
            <label htmlFor="status">STATUS</label>
            <select id="status" name="status" defaultValue={safeDefaults.status}>
              <option value="draft">DRAFT</option>
              <option value="live">LIVE</option>
              <option value="ended">ENDED</option>
            </select>
          </div>
        )}

        <div className="col-span-full flex gap-3.5 justify-end mt-2.5">
          <Link href={cancelHref} className="pixel-btn">
            CANCEL
          </Link>
          <button type="submit" className="pixel-btn pixel-btn-green" disabled={submitting}>
            {submitting ? "SAVING..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
