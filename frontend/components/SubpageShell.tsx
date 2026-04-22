import { ReactNode } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav, type SiteNavProps } from "@/components/SiteNav";
import { Sky } from "@/components/Sky";
import { adminNavItems } from "@/components/site-data";

export type SubpageShellProps = {
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  ctaClass?: string;
  variant?: "student" | "admin";
  navItems?: SiteNavProps["items"];
  homeHref?: string;
  children: ReactNode;
};

export function SubpageShell({
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  ctaClass,
  variant = "student",
  navItems,
  homeHref,
  children,
}: SubpageShellProps) {
  const items = navItems ?? (variant === "admin" ? adminNavItems : undefined);
  return (
    <>
      <Sky />
      <SiteNav
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
        ctaClass={ctaClass}
        items={items}
        variant={variant}
        homeHref={homeHref}
        showLogout
      />
      <div className={`mx-auto my-10 px-6 pb-20 max-[500px]:px-4 ${variant === "admin" ? "max-w-[1280px]" : "max-w-[1200px]"}`}>
        <div className="text-center mb-10 page-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
