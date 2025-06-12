import { Button } from "@/components/ui/button";
import { ContinueGameDialog } from "@/components/ContinueGameDialog";
import { Banner } from "@/game/Header";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for game recovery notification first
    if (window.courtShuffle?.gameRecoveryNeeded) {
      window.courtShuffle.gameRecoveryNeeded = false; // Clear the flag
      toast.error("Game data was corrupted and has been reset", {
        description: "You'll be redirected to create a new game",
        duration: 5000,
      });
      // Navigate to /new after a brief delay
      setTimeout(() => navigate("/new"), 2000);
      return;
    }
  }, [navigate]);

  const handleGetStarted = () => {
    // Always navigate to new game since continue dialog handles existing games
    navigate("/new");
  };

  return (
    <>
      <div className="bg-suit flex min-h-dvh flex-col items-center justify-center p-6">
        <div className="flex w-full max-w-2xl flex-col items-center gap-10 space-y-8">
          <Banner />

          {/* Game Description */}
          <section className="flex max-w-xl flex-col items-center gap-2">
            <h2 className="text-xl font-bold text-slate-500 italic">
              How do we partner up?
            </h2>
            <h1 className="pb-10 text-center text-4xl font-black tracking-tight text-balance md:text-5xl">
              Draw cards to select courts and partners
            </h1>
            <p className="mx-auto pb-10 text-center text-lg text-balance text-slate-400">
              <span className="font-bold text-white italic">It's easy.</span> The
              card's number matches your court. The suit helps you find a partner.
            </p>
            <Button
              onClick={handleGetStarted}
              size="pill-xl"
              variant="accent"
              className="mt-10 px-8 py-6 text-2xl font-bold"
            >
              Shuffle Up &amp; Play
            </Button>
            <div className="font-semibold text-slate-600 italic">IT'S FREE!</div>
          </section>
        </div>
      </div>
      <ContinueGameDialog />
    </>
  );
};

export { Landing };
