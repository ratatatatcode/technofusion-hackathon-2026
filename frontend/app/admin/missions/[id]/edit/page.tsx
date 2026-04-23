import { notFound } from "next/navigation";

import { MissionForm } from "@/components/MissionForm";
import { SubpageShell } from "@/components/SubpageShell";
import { getMission } from "@/lib/api";

type EditMissionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMissionPage({ params }: EditMissionPageProps) {
  const { id } = await params;
  const mission = await getMission(id);

  if (!mission) {
    notFound();
  }

  return (
    <SubpageShell
      variant="admin"
      title="✏ EDIT MISSION"
      subtitle="Update quest details, rewards, and status"
      ctaHref="/admin/missions"
      ctaLabel="← BACK"
      ctaClass="pixel-btn pixel-btn-blue"
    >
      <MissionForm
        mode="edit"
        mission={mission}
        missionId={mission.id}
        cancelHref="/admin/missions"
        successHref="/admin/missions"
        submitLabel="▶ SAVE CHANGES"
        heading="EDIT QUEST DETAILS"
      />
    </SubpageShell>
  );
}
