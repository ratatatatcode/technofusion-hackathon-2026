import { MissionFeed } from "@/components/MissionFeed";
import { SubpageShell } from "@/components/SubpageShell";
import { getCatalog, getMissions } from "@/lib/api";

export default async function MissionsPage() {
  const [missions, catalog] = await Promise.all([
    getMissions({ status: "live" }),
    getCatalog(),
  ]);

  return (
    <SubpageShell
      title="★ MISSION FEED ★"
      subtitle="Pick your next quest, hero."
      ctaHref="/submit-proof"
      ctaLabel="+ SUBMIT PROOF"
      ctaClass="pixel-btn pixel-btn-green"
    >
      <MissionFeed
        missions={missions}
        departments={catalog.departments}
        tiers={catalog.tiers.map((t) => t.value)}
      />
    </SubpageShell>
  );
}
