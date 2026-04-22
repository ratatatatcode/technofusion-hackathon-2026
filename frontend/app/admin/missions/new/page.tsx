import { MissionForm } from "@/components/MissionForm";
import { SubpageShell } from "@/components/SubpageShell";

export default function NewMissionPage() {
  return (
    <SubpageShell
      variant="admin"
      title="+ POST NEW MISSION"
      subtitle="Forge a new quest with full reward details"
      ctaHref="/admin/missions"
      ctaLabel="← BACK"
      ctaClass="pixel-btn pixel-btn-blue"
    >
      <MissionForm cancelHref="/admin/missions" submitLabel="▶ POST MISSION" />
    </SubpageShell>
  );
}
