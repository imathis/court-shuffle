import { cn } from "@/lib/utils";
import { default as Logo } from "@/assets/icons/logo.svg";
import { Card, SuitType } from "@/store/types";

import { CSSProperties } from "react";

const cardStyles = (currentCard: Card | undefined) => {
  if (!currentCard) return;
  switch (SuitType[currentCard.suit]) {
    case "red":
      return {
        "--logo-court-color": "hwb(0 80% 0% / 0.10)",
        "--logo-card-color": "hwb(0 60% 10% / 0.35)",
        "--logo-ball-color": "hwb(0 60% 10% / 0.25)",
      } as CSSProperties;
    case "black":
      return {
        "--logo-court-color": "hwb(223 80% 0% / 0.10)",
        "--logo-card-color": "hwb(223 60% 10% / 0.35)",
        "--logo-ball-color": "hwb(223 60% 10% / 0.25)",
      } as CSSProperties;
    case "purple":
      return {
        "--logo-court-color": "hwb(275 80% 0% / 0.10)",
        "--logo-card-color": "hwb(275 60% 10% / 0.35)",
        "--logo-ball-color": "hwb(275 60% 10% / 0.25)",
      } as CSSProperties;
  }
};

export const LogoBanner: React.FC<{ currentCard?: Card | undefined }> = ({
  currentCard,
}) => {
  return (
    <div className="w-full px-6 text-center" style={cardStyles(currentCard)}>
      <Logo
        className={cn(
          "text-center-block inline-block w-[calc(min(100%,800px))] [&_*]:transition-colors [&_*]:duration-150",
        )}
      />
    </div>
  );
};
