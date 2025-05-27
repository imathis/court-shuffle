import { Id } from "../../convex/_generated/dataModel";
import { StoreApi } from "zustand";
import { UseBoundStore } from "zustand";

export interface Card {
  court: number;
  suit: string;
}

export interface Game {
  slug: string | null;
  cards?: Card[] | undefined;
  courts?: number[] | undefined;
  players?: number | undefined;
  lastDrawn: number;
  perCourt?: number | undefined;
  updatedAt: number;
  syncStatus?: "synced" | "syncing" | "failed" | "unsynced";
}

export interface GameStoreState {
  game: Game;
  isDrawing: boolean;
  configVisible: boolean;
  drawnIndex: number;
  currentCard?: Card | undefined;
}

export interface GameStoreActions {
  configGame: (
    args?: Partial<Pick<Game, "courts" | "players" | "perCourt">>,
  ) => void;
  unShareGame: () => void;
  setDrawnCard: (index: number) => void;
  drawCard: () => void;
  setConfigVisible: (visible: boolean) => void;
  getNavigation: () => {
    back: (() => void) | null;
    next: (() => void) | null;
  };
  getUrl: () => string | null;
  getRoundOver: () => boolean;
  getInProgress: () => boolean;
  setGame: (newGame: Game) => void;
  setSyncStatus: (status: Game["syncStatus"]) => void;
}

export interface ConvexSyncResult {
  enableSync: () => Promise<Game | null>;
  drawCardWithSync: () => Promise<{ card: Card; index: number } | null>;
  configGameWithSync: (
    params: Partial<Pick<Game, "courts" | "players" | "perCourt">>,
  ) => Promise<void>;
  joinGameBySlug: (slug: string) => Promise<Game | null>;
  convexGame: Game | null | undefined;
  isSynced: boolean;
  syncStatus: Game["syncStatus"];
}

export interface GameStoreResult {
  gameStore: UseBoundStore<StoreApi<GameStoreState & GameStoreActions>>;
  setGameConfig: (
    params: Partial<Pick<Game, "courts" | "players" | "perCourt">>,
  ) => Promise<void>;
  drawCard: () => Promise<{ card: Card; index: number } | null>;
  enableSync: () => Promise<Game | null>;
  joinGame: (slug: string) => Promise<Game | null>;
  syncStatus: Game["syncStatus"];
}

export interface GameDoc {
  _id: Id<"games">;
  slug: string;
  cards?: Card[] | undefined;
  courts?: number[] | undefined;
  players?: number | undefined;
  lastDrawn: number;
  perCourt?: number | undefined;
  updatedAt: number;
}
