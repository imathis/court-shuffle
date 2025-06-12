import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShareIcon, Check } from "lucide-react";
import QRCode from "qrcode-svg";

interface ShareViewProps {
  slug: string | null;
  isLoading: boolean;
  error: string | null;
  copied: boolean;
  onBack: () => void;
  onRetry: () => void;
  onShare: () => void;
}

const getUrl = (slug: string) => {
  return `https://courtshuffle.com/join/${slug}`;
};

const QrCode: React.FC<{ url: string }> = ({ url, ...props }) => {
  const svg = React.useMemo(() => {
    const code = new QRCode({
      content: url,
      container: "svg-viewbox", // Responsive use
      join: true, // Crisp rendering and 4-5x reduced file size
    });

    return code.svg();
  }, [url]);

  return (
    <div
      className="overflow-hidden rounded-2xl [&_svg]:aspect-square [&_svg]:w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  );
};

export const ShareView: React.FC<ShareViewProps> = ({
  slug,
  isLoading,
  error,
  copied,
  onBack,
  onRetry,
  onShare,
}) => {
  return (
    <div className="flex flex-col gap-3 text-center">
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          onClick={onBack}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h3 className="text-2xl font-extrabold">Scan to Join</h3>
          <p className="text-slate-300">Draw cards from multiple devices</p>
        </div>
        <div className="w-8" /> {/* Spacer for balance */}
      </div>

      {/* QR Code Area */}
      <div className="mb-4 flex justify-center">
        {isLoading ? (
          <Skeleton className="aspect-square w-full bg-slate-600" />
        ) : slug ? (
          <QrCode url={getUrl(slug)} />
        ) : error ? (
          <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-gray-300">
            <div className="text-center">
              <p className="mb-2 text-sm text-red-600">{error}</p>
              <Button size="sm" onClick={onRetry}>
                Retry
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Share URL */}
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="mb-2 h-4 w-1/2 bg-slate-700" />
          <Skeleton className="mb-2 h-8 w-full bg-slate-400" />
        </div>
      ) : slug ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Or share this URL</p>
          <div className="flex items-center gap-2">
            <p className="text-md flex-1 rounded px-2 py-1 break-all">
              {getUrl(slug).replace("https://", "")}
            </p>
            <Button
              size="icon"
              variant="outline"
              onClick={onShare}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShareIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
