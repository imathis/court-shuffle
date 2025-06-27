import { useServiceWorkerUpdate } from "@/hooks/useServiceWorkerUpdate";

export const UpdatePrompt = () => {
  const { updateAvailable, applyUpdate, dismissUpdate } =
    useServiceWorkerUpdate();

  if (!updateAvailable) return null;

  return (
    <div className="bg-card fixed right-4 bottom-4 left-4 z-50 ml-auto max-w-100 rounded-lg border p-4 shadow-lg">
      <div className="pb-safe-min-4 flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="text-card-foreground font-medium">
            App Update Available
          </p>
          <p className="text-muted-foreground text-sm">
            Reload to get the latest.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={dismissUpdate}
            className="text-muted-foreground hover:text-foreground px-3 py-1 text-sm transition-colors"
          >
            Later
          </button>
          <button
            onClick={() => {
              console.log("Update button clicked");
              applyUpdate();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
