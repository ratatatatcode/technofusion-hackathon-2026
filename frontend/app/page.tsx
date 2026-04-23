import Link from "next/link";
import { MascotGuide } from "@/components/MascotGuide";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { Sky } from "@/components/Sky";
import Image from "next/image";

const featureCards = [
  [
    "/login",
    "📜",
    "MISSION POSTING",
    "Admins post quests with tier, SDG tag, duration, points and rewards.",
  ],
  [
    "/missions",
    "🎯",
    "MISSION FEED",
    "Filter quests by department, tier and SDG. Pick your next adventure.",
  ],
  [
    "/submit-proof",
    "📸",
    "PROOF SUBMISSION",
    "Upload a photo, write a summary, drop the contest event code.",
  ],
  [
    "/verify-queue",
    "✔️",
    "VERIFY QUEUE",
    "Approve or reject submissions with reasons and keep the realm fair.",
  ],
  [
    "/dashboard",
    "🍄",
    "STUDENT DASHBOARD",
    "Total coins, last 5 missions, badges and your current rank.",
  ],
  [
    "/leaderboard",
    "🏆",
    "LEADERBOARD",
    "Seasonal rankings by department and individual with personal relative rank.",
  ],
  [
    "/innovation-wall",
    "⭐",
    "INNOVATION WALL",
    "Live activity ticker plus 17-tile SDG heat map glowing with progress.",
  ],
  [
    "/login",
    "💡",
    "PROBLEM BOARD",
    "Admins post real campus problems — Claude AI splits them into 3 quests.",
  ],
] as const;

const tiers = [
  ["tier-bronze", "🪙", "BRONZE", "+10 PTS", "Daily good deeds"],
  ["tier-silver", "⭐", "SILVER", "+50 PTS", "Weekly missions"],
  ["tier-gold", "🌟", "GOLD", "+150 PTS", "Project quests"],
  ["tier-fire", "🔥", "CONTEST", "+500 PTS", "Event-coded battles"],
] as const;

const howItWorks = [
  [
    "1",
    "🎯",
    "PICK A QUEST",
    "Browse the mission feed. Filter by tier, SDG, or your department.",
  ],
  [
    "2",
    "📸",
    "DO IT IRL",
    "Complete the mission, snap your proof, drop the event code if applicable.",
  ],
  [
    "3",
    "🏆",
    "EARN COINS",
    "Get verified, stack points, climb the leaderboard, unlock badges.",
  ],
] as const;

export default function HomePage() {
  return (
    <>
      <Sky full />
      <SiteNav ctaHref="/login" ctaLabel="► LOGIN" items={[]} homeHref="/" />

      {/* HERO — centered, dramatic, with floating pixel art */}
      <header className="relative z-2 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 min-h-[78vh] overflow-hidden">
        {/* Floating decoration: question blocks + coins + stars */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <span className="coin-icon absolute! top-[60%] left-[14%] w-8! h-8! max-[900px]:hidden!" />
          <span
            className="coin-icon absolute! top-[30%] right-[18%] w-7! h-7! max-[900px]:hidden!"
            style={{ animationDelay: "0.3s" }}
          />
          <span className="star-icon absolute! top-[55%] right-[8%] w-10! h-10! max-[900px]:hidden!" />
          <span
            className="star-icon absolute! top-[70%] left-[6%] w-8! h-8! max-[900px]:hidden!"
            style={{ animationDelay: "0.7s" }}
          />
        </div>

        <Image
          src={"/logo/android-chrome-192x192.png"}
          height={120}
          width={120}
          alt="campus-quest-logo"
          className="logo-bounce relative z-1"
        />
        <h1 className="title-main relative z-1 text-center! max-[900px]:text-[40px]! max-[600px]:text-[28px]!">
          LEVEL UP
          <br />
          <span className="yellow">YOUR</span>{" "}
          <span className="red">CAMPUS</span>
        </h1>
        <p className="subtitle relative z-1 max-w-160 mx-auto text-center!">
          Complete quests, earn coins, climb the leaderboard, and solve real
          campus problems for the SDGs.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-6 mb-10 relative z-1">
          <Link href="/login" className="pixel-btn pixel-btn-green big">
            ▶ PLAY NOW
          </Link>
        </div>

        {/* HUD stats strip */}
        <div className="flex flex-wrap gap-3 justify-center relative z-1">
          <div className="hud-item">
            <span className="coin-icon" /> COINS <b>×128,420</b>
          </div>
          <div className="hud-item">
            <span className="star-icon" /> QUESTS <b>×3,217</b>
          </div>
          <div className="hud-item">
            <span className="mush-icon" /> PLAYERS <b>×1,089</b>
          </div>
        </div>
      </header>

      {/* HOW IT WORKS — 3 steps */}
      <section className="relative z-2 py-16 px-[8%]">
        <h2 className="section-title">
          <span className="yellow">★</span> HOW IT WORKS{" "}
          <span className="yellow">★</span>
        </h2>
        <p className="section-sub">
          Three steps. Infinite quests. One leveled-up campus.
        </p>
        <div className="grid gap-6 grid-cols-3 max-w-275 mx-auto max-[900px]:grid-cols-1">
          {howItWorks.map(([step, icon, title, text]) => (
            <div className="feature-card brick text-center" key={step}>
              <div className="question-block static! mx-auto w-16! h-16! text-2xl! mb-4">
                <span>{step}</span>
              </div>
              <div className="card-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-2 py-16 px-[8%]">
        <h2 className="section-title">
          <span className="yellow">★</span> POWER-UPS{" "}
          <span className="yellow">★</span>
        </h2>
        <p className="section-sub">
          Eight features to turn campus life into a quest.
        </p>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] max-w-325 mx-auto max-[900px]:grid-cols-1">
          {featureCards.map(([, icon, title, text]) => (
            <div className="feature-card brick cursor-default" key={title}>
              <div className="card-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIERS */}
      <section className="relative z-2 py-16 px-[8%]">
        <h2 className="section-title">
          <span className="red">▲</span> QUEST TIERS{" "}
          <span className="red">▲</span>
        </h2>
        <p className="section-sub">
          From daily good deeds to legendary contest battles.
        </p>
        <div className="grid gap-6 grid-cols-4 max-w-[1100px] mx-auto max-[900px]:grid-cols-2 max-[500px]:grid-cols-1">
          {tiers.map(([className, icon, title, points, text]) => (
            <div className={`tier-card ${className}`} key={title}>
              <div className="tier-coin">{icon}</div>
              <h3>{title}</h3>
              <p className="tier-pts">{points}</p>
              <small>{text}</small>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-2 py-16 px-[8%] pb-30">
        <div className="cta-box max-w-205 mx-auto">
          <h2>READY PLAYER ONE?</h2>
          <p>Press START to begin your campus quest.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login" className="pixel-btn pixel-btn-red big">
              ▶ START GAME
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter extended />
      <MascotGuide />
    </>
  );
}
