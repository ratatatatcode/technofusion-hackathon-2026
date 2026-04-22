"use client";

import { useEffect, useState } from "react";
import { SubpageShell } from "@/components/SubpageShell";
import { ConfirmComponent } from "@/components/confirm/confirmComponent";
import { approveSubmission, getSubmissions, rejectSubmission } from "@/lib/api";
import type { Submission } from "@/lib/types";

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

type PendingAction = {
  submissionId: string;
  missionTitle: string;
  action: "approve" | "reject";
} | null;

export default function AdminVerifyQueuePage() {
  const [queue, setQueue] = useState<Submission[]>([]);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  useEffect(() => {
    getSubmissions({ status: "pending" }).then(setQueue);
  }, []);

  const openConfirm = (submissionId: string, missionTitle: string, action: "approve" | "reject") => {
    setPendingAction({ submissionId, missionTitle, action });
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;

    if (pendingAction.action === "approve") {
      await approveSubmission(pendingAction.submissionId);
    } else {
      await rejectSubmission(pendingAction.submissionId, "Rejected by admin");
    }

    setQueue((prev) => prev.filter((item) => item.id !== pendingAction.submissionId));
    setPendingAction(null);
  };

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
              <button
                type="button"
                className="pixel-btn pixel-btn-green"
                onClick={() => openConfirm(submission.id, submission.missionTitle, "approve")}
              >
                ✔ APPROVE
              </button>
              <button
                type="button"
                className="pixel-btn pixel-btn-red"
                onClick={() => openConfirm(submission.id, submission.missionTitle, "reject")}
              >
                ✖ REJECT
              </button>
            </div>
          </div>
        );
      })}

      <ConfirmComponent
        isOpen={pendingAction !== null}
        confirmType={pendingAction?.action ?? null}
        missionTitle={pendingAction?.missionTitle ?? "this submission"}
        onCancel={() => setPendingAction(null)}
        onConfirm={handleConfirm}
      />
    </SubpageShell>
  );
}
