import React from "react";

import { Navigate, useParams } from "react-router-dom";
import { useConvexSync } from "@/hooks/useConvexSync";
import { useGameStore } from "../store/gameStore";

const Join = () => {
  const { slug } = useParams();
  const { joinGameBySlug } = useConvexSync();
  const gameSlug = useGameStore((state) => state.game.slug);
  const courts = useGameStore((state) => state.game.courts);
  const hasJoined = React.useRef(false);

  React.useEffect(() => {
    if (slug && !hasJoined.current) {
      hasJoined.current = true;
      joinGameBySlug(slug);
    }
  }, [slug, joinGameBySlug]);

  if (gameSlug && courts?.length) return <Navigate to="/play" replace />;
  return null;
};

export { Join };
