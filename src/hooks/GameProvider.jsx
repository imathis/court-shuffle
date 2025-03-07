import React from "react";
import { Outlet } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { Config } from "../game/config";

const GameContext = React.createContext({});

const getFormat = ({ card, deck }) => {
  const onCourt = deck.filter(({ court }) => court === card.court).length;
  if (onCourt === 1) return "ROTATION";
  if (onCourt === 2) return "SINGLES";
  if (onCourt === 3) return "3 PLAYER";
  return null;
};

const GameProvider = () => {
  // Get game state from store
  const { game, createGame, configGame, drawCard, enableSync, syncStatus } =
    useGameStore();

  // Local UI state
  const [drawnIndex, setDrawnIndex] = React.useState(-1);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [configVisible, setConfigVisible] = React.useState(false);

  // Handle drawing cards
  const draw = React.useCallback(async () => {
    setIsDrawing(true);
    const result = await drawCard();
    if (result?.card) {
      setDrawnIndex(result.index);
    }
    setTimeout(() => setIsDrawing(false), 800);
    return result?.card;
  }, [drawCard]);

  // Handle configuration
  const config = React.useCallback(
    async (props = {}) => {
      await configGame({
        courts: props.courts,
        players: props.players,
        perCourt: props.perCourt,
      });
      setDrawnIndex(-1);
    },
    [configGame],
  );

  // Sync drawn index with game state
  React.useEffect(() => {
    if (game?.lastDrawn === -1) {
      setDrawnIndex(-1);
    } else if (game?.cards?.length && game?.lastDrawn >= 0) {
      setDrawnIndex(game.lastDrawn);
    }
  }, [game]);

  // Calculate derived values
  const slug = game?.slug;
  const drawnCard = game?.cards?.[drawnIndex] || null;
  const deck = game?.cards || [];
  const format = drawnCard ? getFormat({ card: drawnCard, deck }) : null;
  const cardsRemaining = game?.cards?.length
    ? game.cards.length - (game.lastDrawn + 1)
    : 0;
  const roundOver = Boolean(game?.cards?.length && !cardsRemaining);
  const inProgress = Boolean(game?.cards?.length && !roundOver);

  // Create context value
  const value = {
    game,
    slug,
    create: createGame,
    config,
    draw,
    drawn: {
      card: drawnCard,
      index: drawnIndex,
      format,
      cards: deck.slice(0, game?.lastDrawn + 1 || 0),
    },
    isDrawing,
    previous: drawnIndex >= 1 ? () => setDrawnIndex((i) => i - 1) : null,
    next:
      drawnIndex + 1 <= (game?.lastDrawn || -1)
        ? () => setDrawnIndex((i) => i + 1)
        : null,
    url: slug ? `https://courtshuffle.com/game/${slug}` : null,
    reset: () => {
      config({ game });
    },
    roundOver,
    cardsRemaining,
    inProgress,
    isLoading: typeof game === "undefined",
    notFound: game === null && slug,
    configVisible,
    openConfig: () => setConfigVisible(true),
    closeConfig: () => setConfigVisible(false),
    enableSync,
    syncStatus,
  };

  return (
    <GameContext.Provider value={value}>
      {value.isLoading ? (
        <h1>Loading…</h1>
      ) : (
        <>
          <Outlet />
          <Config {...value} />
        </>
      )}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
