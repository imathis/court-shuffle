import React from "react";
import { Navigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";

const NewGame = () => {
  const { game, createGame } = useGameStore();

  React.useEffect(() => {
    if (!game) {
      (async () => {
        await createGame();
      })();
    }
  }, [createGame]);

  if (game) {
    return <Navigate to={"/play"} />;
  }
  return <h1>Loading…</h1>;
};

export { NewGame };
