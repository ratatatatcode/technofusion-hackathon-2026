import Link from "next/link";
import { studentNavItems, type NavItem } from "@/components/site-data";
import Image from "next/image";

export type SiteNavProps = {
  ctaHref: string;
  ctaLabel: string;
  ctaClass?: string;
  items?: readonly NavItem[];
  variant?: "student" | "admin";
  homeHref?: string;
  showLogout?: boolean;
};

export function SiteNav({
  ctaHref,
  ctaLabel,
  ctaClass = "pixel-btn pixel-btn-red",
  items = studentNavItems,
  variant = "student",
  homeHref,
  showLogout = false,
}: SiteNavProps) {
  const logoHref = homeHref ?? (variant === "admin" ? "/admin" : "/dashboard");
  return (
    <nav className={`pixel-nav nav-${variant}`}>
      <Link href={logoHref} className="logo">
        <Image
          src={"/logo/android-chrome-192x192.png"}
          height={50}
          width={50}
          alt="campus-quest-logo"
        />
        <span className="logo-text">
          CAMPUS<span className="accent">QUEST</span>
        </span>
        {variant === "admin" && <span className="role-pill">ADMIN</span>}
      </Link>
      <ul className="nav-links">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        <Link href={ctaHref} className={ctaClass}>
          {ctaLabel}
        </Link>
        {showLogout && (
          <Link
            href="/login"
            className="pixel-btn pixel-btn-red logout-btn"
            title="Logout"
          >
            ⏻ LOGOUT
          </Link>
        )}
      </div>
    </nav>
  );
}
