import { SubpageShell } from "@/components/SubpageShell";
import { getSubmissions } from "@/lib/api";

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export default async function AdminVerifyQueuePage() {
  const queue = await getSubmissions({ status: "pending" });

  return (
    <SubpageShell
      variant="admin"
      title="✔️ VERIFY QUEUE"
      subtitle={`${queue.length} submissions awaiting admin review.`}
      ctaHref="/admin"
      ctaLabel="← BACK"
      ctaClass="pixel-btn pixel-btn-blue"
    >
      {queue.map((submission) => {
        const submittedMeta = `${timeAgo(submission.submittedAt)}${
          submission.eventCode ? ` · Event Code: ${submission.eventCode} ✓` : ""
        }`;
        return (
          <div className="verify-card" key={submission.id}>
            <div className="proof-img">📷</div>
            <div>
              <h3>{submission.missionTitle}</h3>
              <p>
                <b>Player:</b> {submission.playerName} · {submission.playerDepartment} · {submission.playerYear}
              </p>
              <p>
                <b>Submitted:</b> {submittedMeta}
              </p>
              <p style={{ marginTop: 10, fontStyle: "italic" }}>
                &quot;{submission.summary}&quot;
              </p>
            </div>
            <div className="flex flex-col gap-2 actions">
              <button type="button" className="pixel-btn pixel-btn-green">✔ APPROVE</button>
              <button type="button" className="pixel-btn pixel-btn-red">✖ REJECT</button>
            </div>
          </div>
        );
      })}
    </SubpageShell>
  );
}
