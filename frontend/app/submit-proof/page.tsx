import Link from "next/link";

import { SubpageShell } from "@/components/SubpageShell";

export default function SubmitProofPage() {
  return (
    <SubpageShell
      title="📸 SUBMIT PROOF"
      subtitle="Show the realm what you've done."
      ctaHref="/missions"
      ctaLabel="← BACK"
      ctaClass="pixel-btn pixel-btn-blue"
    >
      <div className="panel">
        <h2>
          QUEST: HACKATHON — GREEN DEVS
          <span className="tier-badge contest" style={{ marginLeft: 10 }}>
            CONTEST
          </span>
        </h2>
        <p className="text-[18px] mb-[18px]">
          Required: 1 team photo, code repo link, 200-word summary, event code.
        </p>
        <form className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1" encType="multipart/form-data">
          <input type="hidden" name="missionId" value="m-4" />
          <div className="field col-span-full">
            <label htmlFor="proof-file">📷 PHOTO EVIDENCE</label>
            <label className="file-drop" htmlFor="proof-file">
              DROP IMAGE HERE OR CLICK TO UPLOAD
              <br />
              <small style={{ fontFamily: "var(--font-body)", fontSize: 18 }}>PNG / JPG · MAX 5MB</small>
            </label>
            <input id="proof-file" name="photo" type="file" accept="image/*" hidden />
          </div>
          <div className="field col-span-full">
            <label htmlFor="summary">TEXT SUMMARY</label>
            <textarea
              id="summary"
              name="summary"
              placeholder="Describe what you did, your impact, and lessons learned..."
            />
          </div>
          <div className="field">
            <label htmlFor="code">🔥 EVENT CODE (CONTEST)</label>
            <input id="code" name="eventCode" type="text" placeholder="e.g. HACK2026" />
          </div>
          <div className="field">
            <label htmlFor="link">LINK (OPTIONAL)</label>
            <input id="link" name="linkUrl" type="url" placeholder="https://github.com/..." />
          </div>
          <div className="col-span-full flex gap-3.5 justify-end mt-2.5">
            <Link href="/missions" className="pixel-btn">
              CANCEL
            </Link>
            <button type="submit" className="pixel-btn pixel-btn-green">
              ▶ SUBMIT PROOF
            </button>
          </div>
        </form>
      </div>
    </SubpageShell>
  );
}
