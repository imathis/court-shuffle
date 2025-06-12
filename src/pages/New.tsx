import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/store/gameStore";

const New = () => {
  const navigate = useNavigate();
  const newGame = useGameStore((state) => state.newGame);

  useEffect(() => {
    // Clear any existing game state
    newGame();

    // Redirect to play route where config will auto-open if no courts
    navigate("/play", { replace: true });
  }, [navigate, newGame]);

  // This component doesn't render anything as it immediately redirects
  return null;
};

export { New };
