import { useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGameStore } from "@/store/gameStore";
import { GameDoc } from "@/store/types";

const isFromPreviousDay = (timestamp: number | undefined): boolean => {
  if (!timestamp) return false;

  const updatedDate = new Date(timestamp);
  const today = new Date();

  updatedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return updatedDate < today;
};

export function useConvexGame() {
  const slug = useGameStore((state) => state.game.slug);
  const lastDrawn = useGameStore((state) => state.game.lastDrawn);
  const syncStatus = useGameStore((state) => state.game.syncStatus);
  const setGame = useGameStore((state) => state.setGame);
  const unShareGame = useGameStore((state) => state.unShareGame);

  const previousLastDrawn = useRef<number>(lastDrawn);

  const convexGame = useQuery(api.game.get, slug ? { slug } : "skip") as
    | GameDoc
    | null
    | undefined;

  useEffect(() => {
    const currentGame = useGameStore.getState().game;

    const shouldConvertToLocalOnly =
      (currentGame.slug && convexGame === null) ||
      (convexGame && isFromPreviousDay(currentGame.updatedAt));

    if (shouldConvertToLocalOnly) {
      unShareGame();
    } else {
      if (
        convexGame &&
        currentGame &&
        JSON.stringify(currentGame) !==
          JSON.stringify({ ...currentGame, ...convexGame })
      ) {
        // Handle card reset when game is reset on server
        if (
          convexGame.lastDrawn === -1 &&
          previousLastDrawn.current !== -1 &&
          previousLastDrawn.current !== undefined
        ) {
          useGameStore.setState({
            currentCard: undefined,
            drawnIndex: -1,
          });
        }

        previousLastDrawn.current = convexGame.lastDrawn;
        setGame({ ...currentGame, ...convexGame });
      }
    }
  }, [convexGame, slug, setGame, unShareGame]);

  return {
    convexGame: slug ? convexGame : null,
    isSynced: !!slug,
    syncStatus,
  };
}
