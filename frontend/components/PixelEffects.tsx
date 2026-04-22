"use client";

import { useEffect } from "react";

function playCoin() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(988, context.currentTime);
    oscillator.frequency.setValueAtTime(1319, context.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.25);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.25);
  } catch {
    // Ignore audio restrictions in unsupported browsers.
  }
}

export function PixelEffects() {
  useEffect(() => {
    const clickableElements = Array.from(
      document.querySelectorAll<HTMLElement>(".pixel-btn, .question-block, .feature-card, .chip, .tab")
    );

    const handleSound = () => playCoin();
    const handleChipToggle = (event: Event) => {
      const element = event.currentTarget as HTMLElement;
      element.classList.toggle("active");
    };
    const handleTabToggle = (event: Event) => {
      const selectedTab = event.currentTarget as HTMLElement;
      const container = selectedTab.closest(".tabs");

      container?.querySelectorAll(".tab").forEach((tab) => {
        tab.classList.remove("active");
      });
      selectedTab.classList.add("active");
    };

    clickableElements.forEach((element) => {
      element.addEventListener("click", handleSound);
    });

    const chips = Array.from(document.querySelectorAll<HTMLElement>(".filters .chip"));
    chips.forEach((chip) => chip.addEventListener("click", handleChipToggle));

    const tabs = Array.from(document.querySelectorAll<HTMLElement>(".tabs .tab"));
    tabs.forEach((tab) => tab.addEventListener("click", handleTabToggle));

    const handleRoleToggle = (event: Event) => {
      const selectedRole = event.currentTarget as HTMLElement;
      const container = selectedRole.closest(".role-grid");
      container?.querySelectorAll<HTMLElement>(".role-card").forEach((card) => {
        card.setAttribute("aria-pressed", "false");
      });
      selectedRole.setAttribute("aria-pressed", "true");
    };

    const roleCards = Array.from(document.querySelectorAll<HTMLElement>(".role-grid .role-card"));
    roleCards.forEach((card) => card.addEventListener("click", handleRoleToggle));

    return () => {
      clickableElements.forEach((element) => {
        element.removeEventListener("click", handleSound);
      });
      chips.forEach((chip) => chip.removeEventListener("click", handleChipToggle));
      tabs.forEach((tab) => tab.removeEventListener("click", handleTabToggle));
      roleCards.forEach((card) => card.removeEventListener("click", handleRoleToggle));
    };
  }, []);

  return null;
}
