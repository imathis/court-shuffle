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

const useGameHooks = () => {
  const { game, createGame, configGame, drawCard, enableSync } = useGameStore();
  const [drawnIndex, setDrawnIndex] = React.useState(-1);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [configVisible, setConfigVisible] = React.useState(false);

  const openConfig = React.useCallback(() => setConfigVisible(true), []);
  const closeConfig = React.useCallback(() => setConfigVisible(false), []);

  const draw = React.useCallback(async () => {
    setIsDrawing(true);
    const result = await drawCard();
    if (result?.card) {
      setDrawnIndex(result.index);
    }
    setTimeout(() => setIsDrawing(false), 800);
    return result?.card;
  }, [drawCard]);

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

  const create = React.useCallback(() => {
    return createGame();
  }, [createGame]);

  // Removed slugFromUrl effect since we rely on game.slug only
  // You might need to manually trigger enableSync if you want to sync with a specific slug
  // For now, enableSync will be called manually or via app logic

  React.useEffect(() => {
    if (game?.lastDrawn === -1) {
      setDrawnIndex(-1);
    } else if (game?.cards?.length && game?.lastDrawn >= 0) {
      setDrawnIndex(game.lastDrawn);
    }
  }, [game]);

  const slug = game?.slug; // Only from game state
  const drawnCard = game?.cards?.[drawnIndex] || null;
  const deck = game?.cards || [];
  const format = drawnCard ? getFormat({ card: drawnCard, deck }) : null;
  const cardsRemaining =
    game?.cards?.length && game.cards.length - (game.lastDrawn + 1);
  const roundOver = game?.cards?.length && !cardsRemaining;
  const inProgress = game?.cards?.length && !roundOver;

  return React.useMemo(
    () => ({
      game,
      slug,
      create,
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
      notFound: game === null && slug, // Adjusted for no URL slug
      configVisible,
      openConfig,
      closeConfig,
    }),
    [
      drawnIndex,
      isDrawing,
      create,
      slug,
      draw,
      game,
      config,
      configVisible,
      openConfig,
      closeConfig,
      cardsRemaining,
      inProgress,
      roundOver,
    ],
  );
};

const GameProvider = () => {
  const value = useGameHooks();
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
