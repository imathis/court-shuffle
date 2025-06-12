import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGameStore } from "@/store/gameStore";
import { Card } from "@/store/types";

export function useConvexRedraw() {
  const game = useGameStore((state) => state.game);
  const localDrawnCards = useGameStore((state) => state.localDrawnCards);
  const drawnIndex = useGameStore((state) => state.drawnIndex);
  const unShareGame = useGameStore((state) => state.unShareGame);
  
  // Always call the hook, but conditionally execute
  const redrawCardMutation = useMutation(api.game.redraw);

  const redrawCard = async (cardIndex?: number): Promise<{
    card: Card;
    swappedCard: Card;
    currentIndex: number;
    swappedIndex: number;
  } | null> => {
    if (!game?.slug) {
      // No slug, redraw locally
      useGameStore.getState().redrawCard(cardIndex);
      return null;
    }

    // Determine which card to redraw
    let currentCardIndex: number;
    if (cardIndex !== undefined) {
      // Validate that the provided cardIndex is in localDrawnCards
      if (!localDrawnCards.includes(cardIndex)) {
        console.error(`Cannot redraw: cardIndex ${cardIndex} is not in locally drawn cards`);
        return null;
      }
      currentCardIndex = cardIndex;
    } else {
      // Use current card (existing behavior)
      currentCardIndex = localDrawnCards[drawnIndex];
      if (currentCardIndex === undefined) {
        console.error("No current card to redraw");
        return null;
      }
    }

    try {
      const result = await redrawCardMutation({ 
        slug: game.slug,
        currentIndex: currentCardIndex
      });
      
      if (result) {
        // The mutation returns the updated deck, so we need to update our local state
        const { cards, currentIndex, swappedIndex } = result;
        
        // Update the game with the new deck order
        useGameStore.getState().setGame({
          ...game,
          cards: cards as Card[],
          updatedAt: Date.now(),
        });

        // Update current card display
        useGameStore.setState({
          currentCard: cards[currentIndex] as Card,
        });

        return {
          card: cards[currentIndex] as Card,
          swappedCard: cards[swappedIndex] as Card,
          currentIndex,
          swappedIndex,
        };
      }
      return null;
    } catch (error) {
      console.error("Redraw error:", error);

      if (
        (error as Error).message?.includes("not found") ||
        (error as { code?: number }).code === 404
      ) {
        console.log(
          "Game not found on Convex during redraw, converting to local-only game"
        );
        unShareGame();
      }
      return null;
    }
  };

  return { redrawCard };
}