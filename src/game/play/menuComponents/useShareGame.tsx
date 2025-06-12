import { useState } from "react";
import { useConvexEnableSync } from "@/hooks/useConvexEnableSync";

const getUrl = (slug: string) => {
  return `https://courtshuffle.com/join/${slug}`;
};

export const useShareGame = (slug: string | null) => {
  const { enableSync } = useConvexEnableSync();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEnableSync = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const syncedGame = await enableSync();
      if (!syncedGame?.slug) {
        setError("Failed to enable sync. Please try again.");
      }
    } catch (err) {
      setError("Failed to enable sync. Please try again.");
      console.error("Failed to enable sync:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareUrl = async () => {
    if (!slug) return;

    const url = getUrl(slug);
    const shareText = `Draw courts with me on CourtShuffle. ${url}`;

    try {
      // Try native share API first (better for mobile)
      if (navigator.share) {
        await navigator.share({
          title: "Court Shuffle Game",
          text: shareText,
        });
        return;
      }

      // Fallback to clipboard for desktop
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to share/copy:", err);

      // Final fallback - copy just the URL
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (copyErr) {
        console.error("Copy also failed:", copyErr);
      }
    }
  };

  const resetShareState = () => {
    setCopied(false);
    setError(null);
  };

  return {
    isLoading,
    error,
    copied,
    handleEnableSync,
    handleShareUrl,
    resetShareState,
  };
};
