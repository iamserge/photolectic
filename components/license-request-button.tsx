"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LicenseOption {
  id: string;
  name: string;
  type: string;
  priceCents: number;
  currency: string;
  description?: string | null;
}

interface LicenseRequestButtonProps {
  photoId: string;
  licenseOption: LicenseOption;
  isAuthenticated: boolean;
}

export function LicenseRequestButton({
  photoId,
  licenseOption,
  isAuthenticated,
}: LicenseRequestButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(cents / 100);
  };

  const handleRequest = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to request a license");
      router.push(`/login?callbackUrl=/gallery/${photoId}`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/licenses/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId,
          licenseOptionId: licenseOption.id,
          intendedUse: `${licenseOption.name} license request`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to request license");
      }

      toast.success("License request submitted successfully!");
      router.push("/dashboard?tab=requests");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-amber-500/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white font-semibold">{licenseOption.name}</h4>
        <span className="text-lg font-bold text-emerald-400">
          {formatPrice(licenseOption.priceCents, licenseOption.currency)}
        </span>
      </div>
      {licenseOption.description && (
        <p className="text-sm text-zinc-400 mb-3">{licenseOption.description}</p>
      )}
      <button
        onClick={handleRequest}
        disabled={isLoading}
        className="w-full py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Request License"
        )}
      </button>
    </div>
  );
}
