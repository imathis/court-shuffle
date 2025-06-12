import { useConvexSync } from "./useConvexSync";
import { GameStoreResult } from "@/store/types";

export function useGameStoreSync(): GameStoreResult {
  const {
    enableSync,
    drawCardWithSync,
    configGameWithSync,
    joinGameBySlug,
    syncStatus,
  } = useConvexSync();

  return {
    setGameConfig: configGameWithSync,
    drawCard: drawCardWithSync,
    enableSync,
    joinGame: joinGameBySlug,
    syncStatus,
  };
}
