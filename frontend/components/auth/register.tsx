"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { Sky } from "@/components/Sky";
import { useRegister } from "@/lib/hooks/useAuth";
import React, { useState } from "react";
import type { authData } from "@/lib/types/authData";

const colleges = ["CAFAD", "CET", "CICS", "COE"] as const;

export default function RegisterComponent() {
  const register = useRegister();

  const [form, setForm] = useState<authData>({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "student",
    department: null,
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    register.mutate(form);
  };

  return (
    <>
      <Sky full />
      <main className="relative z-1 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 pt-10 pb-20">
        <Link href="/" className="auth-logo">
          <span className="coin-icon" />
          <span className="logo-text">
            CAMPUS<span className="accent">QUEST</span>
          </span>
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <h1>► NEW PLAYER</h1>
            <p>Create your account to start questing</p>
          </div>

          <form
            onSubmit={handleRegistration}
            className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1"
          >
            <div className="field">
              <label htmlFor="su-id">SCHOOL ID</label>
              <input
                id="su-id"
                name="id"
                type="text"
                placeholder="e.g. 12-34567"
                autoComplete="username"
                value={form.id || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="su-name">FULL NAME</label>
              <input
                id="su-name"
                name="name"
                type="text"
                placeholder="Mario Rossi"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field col-span-full">
              <label htmlFor="su-email">EMAIL</label>
              <input
                id="su-email"
                name="email"
                type="email"
                placeholder="12-34567@g.batstate-u.edu.ph"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field col-span-full">
              <label htmlFor="su-pw">PASSWORD</label>
              <input
                id="su-pw"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field col-span-full">
              <label htmlFor="su-confirm-pw">CONFIRM PASSWORD</label>
              <input
                id="su-confirm-pw"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="su-role">ROLE</label>
              <select
                id="su-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="student">🍄 STUDENT</option>
                <option value="admin">👑 ADMIN</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="su-colg">COLLEGE</label>
              <select
                id="su-colg"
                name="department"
                value={form.department ?? ""}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select college
                </option>
                {colleges.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-full flex flex-wrap gap-3 justify-end mt-2.5 auth-actions">
              <button
                type="submit"
                className="pixel-btn pixel-btn-green big"
                disabled={register.isPending}
              >
                {register.isPending ? "▶ CREATING..." : "▶ CREATE ACCOUNT"}
              </button>
            </div>

            {register.isError && (
              <p className="col-span-full text-center text-sm text-red-500">
                {register.error.message}
              </p>
            )}

            {register.isSuccess && (
              <p className="col-span-full text-center text-sm text-green-500">
                Account created successfully.
              </p>
            )}

            <p className="col-span-full text-center text-sm text-(--text-dark) mt-2">
              Already have an account?{" "}
              <Link href="/login" className="auth-link">
                Log in
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
