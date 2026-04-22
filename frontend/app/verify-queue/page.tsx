import { redirect } from "next/navigation";

export default function VerifyQueueRedirect() {
  redirect("/admin/verify-queue");
}
