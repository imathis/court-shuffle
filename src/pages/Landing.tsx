import { ContinueGameDialog } from "@/components/landing/ContinueGameDialog";
import { Feature } from "@/components/landing/feature";
import { Matchup } from "@/components/landing/matchupCard";
import { LogoBanner } from "@/components/LogoBanner";
import { Button } from "@/components/ui/button";
import { CloudOff, Maximize2, RefreshCw } from "lucide-react";
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
      <div className="pt-safe min-h-dvh bg-slate-950">
        <div className="flex flex-row justify-between gap-4 bg-slate-950 p-6">
          <LogoBanner className="w-60" />
          <Button onClick={handleGetStarted} size="pill" className="font-bold">
            Play!
          </Button>
        </div>
        <section className="flex w-full flex-col items-center gap-12 bg-slate-900 py-15">
          {/* Game Description */}
          <header className="flex max-w-xl flex-col items-center gap-3 text-center">
            <div className="text-2xl leading-5 font-normal text-slate-400">
              No more asking
            </div>{" "}
            <h2 className="text-5xl leading-10 font-bold tracking-tight text-balance text-slate-200">
              “How should we partner up?“
            </h2>
            <p className="text-lg text-balance text-slate-400">
              Easy organize group play for Tennis or Pickleball. Draw virtual
              playing cards to randomize courts and matchups.
            </p>
          </header>
          <Button
            onClick={handleGetStarted}
            size="pill-xl"
            variant="accent"
            className="px-10 py-8 text-3xl font-bold"
          >
            Get Started
          </Button>
        </section>
        <section className="flex w-full flex-col items-center gap-8 bg-linear-to-b from-slate-950 to-slate-900 px-10 py-15 lg:px-0">
          <div className="grid max-w-xl gap-2">
            <h3 className="text-3xl font-bold">How does it work?</h3>
            <p className="mx-auto text-lg leading-5 text-slate-400">
              Each player draws a card. The card's number matches the court, and
              the suit helps you find a partner or opponent.
            </p>
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <Matchup
              court={4}
              type="Opponents"
              cards={["4H", "4S"]}
              className="bg-red-900"
            />
            <Matchup
              court={3}
              type="Partners"
              cards={["3H", "3D"]}
              className="bg-indigo-900"
            />
          </div>
        </section>
        <section className="grid w-full bg-slate-900 py-15">
          <div className="grid w-full max-w-5xl justify-around gap-x-5 gap-y-15 place-self-center px-5 text-center md:grid-flow-col md:px-10 md:text-left">
            <Feature
              title="Flexible Play"
              desc="Singles, Doubles, and odd numbers.
              Easily accomodate up to 52 players"
              icon={Maximize2}
            />
            <Feature
              title="Multi-device Sync"
              desc="Share with others and draw from the same deck, synced instantly"
              icon={RefreshCw}
            />
            <Feature
              title="Offline Mode"
              desc="Save to your homescreen and play any time, without internet"
              icon={CloudOff}
            />
          </div>
        </section>
        <footer className="justify-self-end py-5 text-center text-slate-400">
          Copyright © {new Date().getFullYear()}{" "}
          <a
            className="hover:text-accent cursor-pointer text-slate-300"
            href="https://brandonmathis.com"
          >
            Brandon Mathis
          </a>
        </footer>
      </div>
      <ContinueGameDialog />
    </>
  );
};

export { Landing };
