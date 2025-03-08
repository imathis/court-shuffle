import React from "react";
import PropTypes from "prop-types";

import { Navigate, useParams } from "react-router-dom";
import { useGame } from "../hooks";

const Join = () => {
  const { slug } = useParams();
  const { game, joinGame } = useGame();
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
