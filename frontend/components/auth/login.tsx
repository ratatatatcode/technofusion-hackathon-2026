"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { Sky } from "@/components/Sky";
import { useLogin } from "@/lib/hooks/useAuth";
import React, { useState } from "react";
import type { userCredentials } from "@/lib/types/authData";
import { useRouter } from "next/navigation";

export default function LoginComponent() {
  const login = useLogin();
  const router = useRouter();

  const [form, setForm] = useState<userCredentials>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login.mutate(form, {
      onSuccess: (data) => {
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      },
    });
  };

  return (
    <>
      <Sky full />
      <main className="relative z-1 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 pt-10 pb-20">
        <Link href="/" className="auth-logo">
          <span className="logo-text">
            CAMPUS<span className="accent">QUEST</span>
          </span>
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <h1>► PRESS START</h1>
            <p>Log in to continue your quest</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1"
          >
            <div className="field col-span-full">
              <label htmlFor="auth-email">EMAIL</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                placeholder="12-34567@g.batstate-u.edu.ph"
                autoComplete="username"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field col-span-full">
              <label htmlFor="auth-pw">PASSWORD</label>
              <input
                id="auth-pw"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field col-span-full auth-options">
              <label className="auth-check">
                <input type="checkbox" className="cursor-pointer" />
                Remember me
              </label>
              <Link href="#" className="auth-forgot">
                Forgot password?
              </Link>
            </div>

            <div className="col-span-full flex flex-wrap gap-3 justify-end mt-2.5 auth-actions">
              <button
                type="submit"
                className="pixel-btn pixel-btn-green big"
                disabled={login.isPending}
              >
                {login.isPending ? "▶ LOGGING IN..." : "▶ ENTER"}
              </button>
            </div>

            {login.isError && (
              <p className="col-span-full text-center text-sm text-red-500">
                {login.error.message}
              </p>
            )}

            {login.isSuccess && (
              <p className="col-span-full text-center text-sm text-green-500">
                Login successful!
              </p>
            )}

            <p className="col-span-full text-center text-sm text-(--text-dark) mt-2">
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
