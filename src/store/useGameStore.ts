import { useConvexSync } from "./useConvexSync";
import { gameStore } from "./gameStore";
import { GameStoreResult } from "./types";

export function useGameStore(): GameStoreResult {
  const {
    enableSync,
    drawCardWithSync,
    configGameWithSync,
    joinGameBySlug,
    syncStatus,
  } = useConvexSync();

  return {
    gameStore,
    setGameConfig: configGameWithSync,
    drawCard: drawCardWithSync,
    enableSync,
    joinGame: joinGameBySlug,
    syncStatus,
  };
}
