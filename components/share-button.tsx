"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : url;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Photolectic`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
        if ((err as Error).name !== "AbortError") {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
      aria-label="Share photo"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
}
