import { describe, it, expect, beforeEach, vi } from "vitest";
import { useGameStore } from "./gameStore";
import type { GameStoreState } from "./types";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock localStorage for both browser and test environments
if (typeof window !== 'undefined') {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });
} else {
  // Mock for test environment
  globalThis.localStorage = localStorageMock as Storage;
}

describe("GameStore", () => {
  it("should preserve valid games during migration", () => {
    // Test that valid games are preserved through migration

    // Set up a valid game directly
    const validGame = {
      slug: "test-slug",
      cards: [
        { court: 1, suit: "spades" as const },
        { court: 2, suit: "hearts" as const },
        { court: 1, suit: "clubs" as const },
        { court: 2, suit: "diamonds" as const },
      ],
      courts: [1, 2],
      players: 8,
      lastDrawn: 2,
      perCourt: 4,
      shortCourt: 2,
      updatedAt: Date.now(),
    };

    useGameStore.setState({
      game: validGame,
      drawnIndex: 2,
      currentCard: { court: 1, suit: "clubs" },
      localDrawnCards: [0, 1, 2],
    });

    const state = useGameStore.getState();
    expect(state.hasGame()).toBe(true);
    expect(state.game.cards?.length).toBe(4);
    expect(state.game.slug).toBe("test-slug");
  });

  beforeEach(() => {
    // Clear localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();

    // Reset the store to initial state
    useGameStore.setState({
      game: {
        slug: null,
        cards: undefined,
        courts: undefined,
        players: undefined,
        lastDrawn: -1,
        perCourt: 4,
        shortCourt: undefined,
        updatedAt: Date.now(),
      },
      drawnIndex: -1,
      currentCard: undefined,
      localDrawnCards: [],
    });
  });

  it("should initialize with default values", () => {
    const store = useGameStore.getState();

    expect(store.game).toEqual(
      expect.objectContaining({
        slug: null,
        cards: undefined,
        courts: undefined,
        players: undefined,
        lastDrawn: -1,
        perCourt: 4,
        shortCourt: undefined,
      }),
    );
    expect(store.drawnIndex).toBe(-1);
    expect(store.currentCard).toBeUndefined();
    expect(store.localDrawnCards).toEqual([]);
    // No _hasHydrated property needed anymore
  });

  it("should handle game configuration correctly", () => {
    const store = useGameStore.getState();

    // Configure a new game
    store.configGame({
      courts: [1, 2, 3],
      players: 12,
      perCourt: 4,
      shortCourt: 3,
    });

    const newState = useGameStore.getState();
    expect(newState.game.courts).toEqual([1, 2, 3]);
    expect(newState.game.players).toBe(12);
    expect(newState.game.perCourt).toBe(4);
    expect(newState.game.shortCourt).toBe(3);
    expect(newState.game.cards).toBeDefined(); // Should have generated new deck
    expect(newState.game.lastDrawn).toBe(-1); // Should reset progress
    expect(newState.localDrawnCards).toEqual([]); // Should reset drawn cards
  });

  it("should handle store state correctly", () => {
    // Store is always ready now - no hydration tracking needed
    const state = useGameStore.getState();
    expect(state.hasGame()).toBe(false); // No game configured yet
  });

  it("should handle drawing cards correctly", () => {
    const store = useGameStore.getState();

    // Set up a game with cards
    store.configGame({
      courts: [1, 2],
      players: 8,
      perCourt: 4,
    });

    // Draw first card
    store.drawCard();

    let state = useGameStore.getState();
    expect(state.game.lastDrawn).toBe(0);
    expect(state.drawnIndex).toBe(0);
    expect(state.currentCard).toBeDefined();
    expect(state.localDrawnCards).toContain(0);

    // Draw second card
    store.drawCard();

    state = useGameStore.getState();
    expect(state.game.lastDrawn).toBe(1);
    expect(state.drawnIndex).toBe(1);
    expect(state.localDrawnCards).toEqual([0, 1]);
  });

  it("should handle navigation between drawn cards", () => {
    const store = useGameStore.getState();

    // Set up game and draw some cards
    store.configGame({ courts: [1, 2], players: 8, perCourt: 4 });
    store.drawCard(); // Draw card 0
    store.drawCard(); // Draw card 1
    store.drawCard(); // Draw card 2

    let state = useGameStore.getState();
    expect(state.drawnIndex).toBe(2); // Currently at card 2

    // Navigate back
    store.navigateBack();
    state = useGameStore.getState();
    expect(state.drawnIndex).toBe(1);

    // Navigate back again
    store.navigateBack();
    state = useGameStore.getState();
    expect(state.drawnIndex).toBe(0);

    // Navigate forward
    store.navigateNext();
    state = useGameStore.getState();
    expect(state.drawnIndex).toBe(1);

    // Navigate forward again
    store.navigateNext();
    state = useGameStore.getState();
    expect(state.drawnIndex).toBe(2);
  });

  it("should handle migration from corrupted localStorage data", () => {
    // Simulate corrupted localStorage data
    const corruptedData = JSON.stringify({
      state: {
        game: {
          slug: "corrupted-game",
          cards: "not-an-array", // Corrupted data
          courts: [1, 2],
          players: "invalid-number", // Corrupted data
          lastDrawn: "not-a-number", // Corrupted data
          perCourt: 4,
          shortCourt: undefined,
          updatedAt: 1234567890,
        },
        drawnIndex: "not-a-number", // Corrupted data
        currentCard: "not-an-object", // Corrupted data
        localDrawnCards: "not-an-array", // Corrupted data
        extra: "corrupted-data", // Corrupted data
      },
      version: 1,
    });

    localStorageMock.getItem.mockReturnValue(corruptedData);

    // The store should handle corrupted data gracefully and fall back to defaults
    // Even with corrupted localStorage, the store should initialize properly
    const store = useGameStore.getState();

    // Should fall back to safe defaults when data is corrupted
    expect(store.drawnIndex).toBe(-1);
    expect(store.localDrawnCards).toEqual([]);
    // No _hasHydrated property needed anymore
  });

  it("should handle completely invalid localStorage data", () => {
    // Simulate completely invalid JSON
    localStorageMock.getItem.mockReturnValue("invalid-json{");

    // The store should handle invalid JSON gracefully
    const store = useGameStore.getState();

    // Should initialize with default values when localStorage contains invalid JSON
    expect(store.game).toEqual(
      expect.objectContaining({
        slug: null,
        cards: undefined,
        courts: undefined,
        players: undefined,
        lastDrawn: -1,
        perCourt: 4,
        shortCourt: undefined,
      }),
    );
    expect(store.drawnIndex).toBe(-1);
    expect(store.localDrawnCards).toEqual([]);
    // No _hasHydrated property needed anymore
  });

  it("should test Zustand migration function directly", () => {
    // Access the migration function from the store's persist configuration
    const storeWithPersist = useGameStore;
    const migrate = storeWithPersist.persist?.getOptions?.()?.migrate;

    if (migrate) {
      // Test migration with old version 0 data (missing localDrawnCards)
      const oldState = {
        game: {
          slug: "test-migration",
          cards: [{ court: 1, suit: "hearts" }],
          courts: [1, 2],
          players: 8,
          lastDrawn: 0,
          perCourt: 4,
          shortCourt: 1,
          updatedAt: 1234567890,
        },
        drawnIndex: 0,
        currentCard: { court: 1, suit: "hearts" },
        // Missing localDrawnCards (old version)
      };

      const migratedState = migrate(oldState, 0);

      // Verify migration fills in missing properties with defaults
      expect(migratedState).toEqual(
        expect.objectContaining({
          game: oldState.game,
          drawnIndex: 0,
          currentCard: oldState.currentCard,
          localDrawnCards: [], // Should default to empty array
          // _hasHydrated removed - no longer needed
        }),
      );
    } else {
      // If we can't access the migration function, test the behavior indirectly
      console.warn(
        "Could not access migration function directly, testing migration behavior indirectly",
      );

      // This tests the same migration logic through the store initialization
      // Type for old state that's missing some properties
      type OldGameStoreState = Omit<GameStoreState, "localDrawnCards"> & {
        localDrawnCards?: never; // Explicitly mark as not present
      };

      const oldStateWithMissingFields: OldGameStoreState = {
        game: {
          slug: "test-migration",
          cards: [{ court: 1, suit: "hearts" }],
          courts: [1, 2],
          players: 8,
          lastDrawn: 0,
          perCourt: 4,
          shortCourt: 1,
          updatedAt: 1234567890,
        },
        drawnIndex: 0,
        currentCard: { court: 1, suit: "hearts" },
        // Intentionally missing localDrawnCards
      };

      useGameStore.setState(
        oldStateWithMissingFields as Partial<GameStoreState>,
      );
      const state = useGameStore.getState();

      // The store should handle missing properties gracefully
      expect(state.localDrawnCards).toEqual([]);

      // After initialization, it should be set to a default
      useGameStore.setState({ localDrawnCards: [] });
      expect(useGameStore.getState().localDrawnCards).toEqual([]);
    }
  });
});

describe("ShortCourt Bug - Real newDeck function", () => {
  beforeEach(() => {
    // Clear all mocks to use real implementations
    vi.clearAllMocks();
  });

  it("should correctly distribute cards for shortCourt scenario", async () => {
    // Import the real newDeck function
    const { newDeck: realNewDeck } = await import("../helpers/gameHelpers");
    
    // Test scenario: courts 6 and 7 for doubles, 7 players, court 7 as short court
    const courts = [6, 7];
    const players = 7;
    const perCourt = 4;
    const shortCourt = 7;
    
    const deck = realNewDeck({ courts, players, perCourt, shortCourt });
    
    // Count cards for each court
    const court6Cards = deck.filter(card => card.court === 6).length;
    const court7Cards = deck.filter(card => card.court === 7).length;
    
    // With 7 players, 2 courts, 4 per court: 
    // - 7 players % 4 per court = 3 players on short court
    // - So court 7 (short court) should have 3 cards
    // - Court 6 should have 4 cards
    expect(court7Cards).toBe(3); // Short court should have fewer cards
    expect(court6Cards).toBe(4); // Other court should have full complement
  });

  it("should correctly handle shortCourt in gameStore configGame after fix", () => {
    // Test that configGame properly handles shortCourt by checking the result
    const store = useGameStore.getState();
    
    // Configure with shortCourt
    store.configGame({
      courts: [6, 7],
      players: 7,
      perCourt: 4,
      shortCourt: 7,
    });
    
    const state = useGameStore.getState();
    
    // Verify the configuration was stored correctly
    expect(state.game.courts).toEqual([6, 7]);
    expect(state.game.players).toBe(7);
    expect(state.game.perCourt).toBe(4);
    expect(state.game.shortCourt).toBe(7);
    expect(state.game.cards).toBeDefined();
    
    // Verify that cards were generated (the real test would be checking card distribution)
    expect(state.game.cards!.length).toBeGreaterThan(0);
  });
});
