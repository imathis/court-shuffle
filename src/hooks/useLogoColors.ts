import { useGameStore } from "@/store/gameStore";
import { SuitType } from "@/store/types";
import { CSSProperties } from "react";

export const useLogoColors = () => {
  const currentCard = useGameStore((state) => state.currentCard);
  if (!currentCard) return {};
  switch (SuitType[currentCard.suit]) {
    case "red":
      return {
        "--logo-court-color": "hwb(0 80% 0% / 0.10)",
        "--logo-card-color": "hwb(0 60% 10% / 0.35)",
        // "--logo-ball-color": "hwb(0 60% 10% / 0.25)",
      } as CSSProperties;
    case "black":
      return {
        "--logo-court-color": "hwb(223 80% 0% / 0.10)",
        "--logo-card-color": "hwb(223 60% 10% / 0.35)",
        // "--logo-ball-color": "hwb(223 60% 10% / 0.25)",
      } as CSSProperties;
    case "purple":
      return {
        "--logo-court-color": "hwb(275 80% 0% / 0.10)",
        "--logo-card-color": "hwb(275 60% 10% / 0.35)",
        // "--logo-ball-color": "hwb(275 60% 10% / 0.25)",
      } as CSSProperties;
  }
};
