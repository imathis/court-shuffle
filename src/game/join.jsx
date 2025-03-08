import React from "react";
import PropTypes from "prop-types";

import { Navigate, useParams } from "react-router-dom";
import { useGameStore } from "../store/gameStore";

const Join = () => {
  const { slug } = useParams();
  const { gameStore, joinGame } = useGameStore();
  const game = gameStore((state) => state.game);
  React.useEffect(() => {
    if (slug) {
      joinGame(slug);
    }
  }, [slug]);

  if (game.slug) return <Navigate to="/" replace />;
  return null;
};

Join.propTypes = {
  slug: PropTypes.string,
};

Join.defaultProps = {
  slug: undefined,
};

export { Join };
