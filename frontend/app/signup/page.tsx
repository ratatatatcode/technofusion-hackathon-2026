import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { Sky } from "@/components/Sky";

const departments = ["CCS", "COE", "CBA", "CAS", "COED"] as const;

export default function SignupPage() {
  return (
    <>
      <Sky full />
      <main className="relative z-[1] min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 pt-10 pb-20">
        <Link href="/" className="auth-logo">
          <span className="coin-icon" />
          <span className="logo-text">
            MISSION<span className="accent">QUEST</span>
          </span>
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <h1>► NEW PLAYER</h1>
            <p>Create your account to start questing</p>
          </div>

          <form className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
            <div className="field">
              <label htmlFor="su-id">SCHOOL ID</label>
              <input id="su-id" name="id" type="text" placeholder="e.g. 2026-00001" autoComplete="username" required />
            </div>
            <div className="field">
              <label htmlFor="su-name">FULL NAME</label>
              <input id="su-name" name="name" type="text" placeholder="Mario Rossi" autoComplete="name" required />
            </div>

            <div className="field col-span-full">
              <label htmlFor="su-email">EMAIL</label>
              <input id="su-email" name="email" type="email" placeholder="player@campus.edu" autoComplete="email" required />
            </div>

            <div className="field col-span-full">
              <label htmlFor="su-pw">PASSWORD</label>
              <input id="su-pw" name="password" type="password" placeholder="••••••••" autoComplete="new-password" required />
            </div>

            <div className="field">
              <label htmlFor="su-role">ROLE</label>
              <select id="su-role" name="role" defaultValue="student" required>
                <option value="student">🍄 STUDENT</option>
                <option value="admin">👑 ADMIN</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="su-dept">DEPARTMENT</label>
              <select id="su-dept" name="department" defaultValue="" required>
                <option value="" disabled>Select department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="col-span-full flex flex-wrap gap-3 justify-end mt-2.5 auth-actions">
              <button type="submit" className="pixel-btn pixel-btn-green big">
                ▶ CREATE ACCOUNT
              </button>
            </div>

            <p className="col-span-full text-center text-sm text-[var(--text-dark)] mt-2">
              Already have an account? <Link href="/login" className="auth-link">Log in</Link> · or
              {" "}<Link href="/" className="auth-link">return to title screen</Link>
            </p>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
