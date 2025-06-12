import { Id } from "../../convex/_generated/dataModel";

export const SuitType = {
  spades: "black",
  clubs: "black",
  diamonds: "red",
  hearts: "red",
  joker: "purple",
} as const;

// Define types for courts and suits
export const Courts = [
  "X",
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "J",
  "Q",
  "K",
] as const;
export type Court = (typeof Courts)[number];

export const suits = {
  spades: "S",
  clubs: "C",
  hearts: "H",
  diamonds: "D",
} as const;
export type SuitName = keyof typeof suits; // Only the keys of suits object
type Suit = SuitName | "joker"; // Include 'joker' as a valid suit

// Define card name type
export type CardName = `${Court}${(typeof suits)[SuitName]}` | "X";

// Define Card interface
export interface Card {
  court: number; // Index into courts array
  suit: Suit;
}

/** A number representing a valid index of game.cards (0 to cards.length - 1) */
export type CardIndex = number;

// Game type
export interface Game {
  slug: string | null;
  cards?: Card[];
  courts?: number[];
  players?: number;
  lastDrawn: number;
  perCourt?: number;
  shortCourt?: number;
  updatedAt: number;
  syncStatus?: "synced" | "syncing" | "failed" | "unsynced";
}

// Game store state
export interface GameStoreState {
  game: Game;
  drawnIndex: number;
  currentCard?: Card;
  localDrawnCards: number[]; // Client-only list of drawn card indexes
}

// Shared config parameters type
export type GameConfigParams = Partial<
  Pick<Game, "courts" | "players" | "perCourt" | "shortCourt">
>;

// Game lifecycle status object
export interface GameStatus {
  hasGame: boolean; // Game exists (any state)
  canPlay: boolean; // Game configured and ready to play
  isPlaying: boolean; // Game actively in progress
  isComplete: boolean; // Round finished
}

// Game store actions
export interface GameStoreActions {
  configGame: (args?: GameConfigParams) => void;
  newGame: () => void;
  unShareGame: () => void;
  setDrawnCard: (index: number) => void;
  drawCard: () => void;
  redrawCard: (cardIndex?: number) => void;
  navigateBack: () => void;
  navigateNext: () => void;
  // Lifecycle methods
  hasGame: () => boolean;
  canPlay: () => boolean;
  isPlaying: () => boolean;
  isComplete: () => boolean;
  getGameStatus: () => GameStatus;
  // Other methods
  setGame: (newGame: Game) => void;
  setSyncStatus: (status: Game["syncStatus"]) => void;
  addLocalDrawnCard: (index: number) => void;
  resetLocalDrawnCards: () => void;
}

// Partial state type for flexible state typing
export type PartialGameStoreState = Partial<GameStoreState>;

// Individual Convex hook types
export interface ConvexDrawResult {
  drawCard: () => Promise<{ card: Card; index: number } | null>;
}

export interface ConvexJoinResult {
  joinGameBySlug: (slug: string) => Promise<Game | null>;
}

export interface ConvexConfigResult {
  configGameWithSync: (params: GameConfigParams) => Promise<void>;
}

export interface ConvexEnableSyncResult {
  enableSync: () => Promise<Game | null>;
}

export interface ConvexGameResult {
  convexGame: Game | null | undefined;
  isSynced: boolean;
  syncStatus: Game["syncStatus"];
}

// Legacy types for backward compatibility
export interface ConvexSyncResult {
  enableSync: () => Promise<Game | null>;
  drawCardWithSync: () => Promise<{ card: Card; index: number } | null>;
  configGameWithSync: (params: GameConfigParams) => Promise<void>;
  joinGameBySlug: (slug: string) => Promise<Game | null>;
  convexGame: Game | null | undefined;
  isSynced: boolean;
  syncStatus: Game["syncStatus"];
}

export interface GameStoreResult {
  setGameConfig: (params: GameConfigParams) => Promise<void>;
  drawCard: () => Promise<{ card: Card; index: number } | null>;
  enableSync: () => Promise<Game | null>;
  joinGame: (slug: string) => Promise<Game | null>;
  syncStatus: Game["syncStatus"];
}

// Game document
export interface GameDoc {
  _id: Id<"games">;
  slug: string;
  cards?: Card[];
  courts?: number[];
  players?: number;
  lastDrawn: number;
  perCourt?: number;
  updatedAt: number;
  shortCourt: number | undefined;
}
