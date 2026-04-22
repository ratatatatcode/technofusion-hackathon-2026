import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { Sky } from "@/components/Sky";

export default function LoginPage() {
  return (
    <>
      <Sky full />
      <main className="relative z-[1] min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 pt-10 pb-20">
        <Link href="/" className="auth-logo">
          <span className="coin-icon" />
          <span className="logo-text">
            CAMPUS<span className="accent">QUEST</span>
          </span>
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <h1>► PRESS START</h1>
            <p>Choose your player to log in</p>
          </div>

          <form className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
            <div className="field col-span-full">
              <label htmlFor="auth-id">SCHOOL ID / USERNAME</label>
              <input
                id="auth-id"
                type="text"
                placeholder="e.g. 12-34567"
                autoComplete="username"
              />
            </div>
            <div className="field col-span-full">
              <label htmlFor="auth-pw">PASSWORD</label>
              <input
                id="auth-pw"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="field col-span-full auth-options">
              <label className="auth-check">
                <input type="checkbox" className="cursor-pointer" /> Remember me
              </label>
              <Link href="#" className="auth-forgot">
                Forgot password?
              </Link>
            </div>

            <div className="col-span-full flex flex-wrap gap-3 justify-end mt-2.5 auth-actions">
              <Link href="/dashboard" className="pixel-btn pixel-btn-green big">
                ▶ ENTER AS STUDENT
              </Link>
              <Link href="/admin" className="pixel-btn pixel-btn-red big">
                👑 ENTER AS ADMIN
              </Link>
            </div>

            <p className="col-span-full text-center text-sm text-[var(--text-dark)] mt-2">
              No account yet?{" "}
              <Link href="/signup" className="auth-link">
                Sign up
              </Link>{" "}
              · or{" "}
              <Link href="/" className="auth-link">
                return to title screen
              </Link>
            </p>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
