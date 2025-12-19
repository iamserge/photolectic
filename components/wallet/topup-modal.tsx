"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, CreditCard, Loader2, Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TopupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onSuccess: (newBalance: number) => void;
}

const quickAmounts = [
  { credits: 100, price: 10, label: "Starter" },
  { credits: 500, price: 50, label: "Popular", popular: true },
  { credits: 1000, price: 100, label: "Pro" },
];

export function TopupModal({ open, onOpenChange, currentBalance, onSuccess }: TopupModalProps) {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const effectiveAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  const priceUsd = effectiveAmount / 10;

  const handlePurchase = async () => {
    if (effectiveAmount < 10) return;

    setLoading(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          paymentMethod: "card",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setTimeout(() => {
          onSuccess(data.balance);
          setSuccess(false);
          setSelectedAmount(null);
          setCustomAmount("");
        }, 1500);
      }
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomChange = (value: string) => {
    setSelectedAmount(null);
    setCustomAmount(value.replace(/\D/g, ""));
  };

  const handleQuickSelect = (credits: number) => {
    setCustomAmount("");
    setSelectedAmount(credits);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Coins className="w-5 h-5 text-amber-500" />
            Add Credits
          </DialogTitle>
          <DialogDescription>
            Purchase credits to buy photos. 10 credits = $1 USD
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="py-12 text-center"
            >
              <motion.div
                className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
              >
                <Check className="w-8 h-8 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Credits Added!</h3>
              <p className="text-zinc-400">
                +{effectiveAmount.toLocaleString()} credits added to your wallet
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-4"
            >
              {/* Current Balance */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <span className="text-sm text-zinc-400">Current Balance</span>
                <span className="font-semibold text-white">
                  {currentBalance.toLocaleString()} credits
                </span>
              </div>

              {/* Quick Select */}
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((option) => (
                  <motion.button
                    key={option.credits}
                    onClick={() => handleQuickSelect(option.credits)}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all",
                      selectedAmount === option.credits
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/50"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-semibold">
                        Popular
                      </span>
                    )}
                    <p className="text-2xl font-bold text-white">{option.credits}</p>
                    <p className="text-xs text-zinc-400">${option.price}</p>
                  </motion.button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Or enter custom amount</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    type="text"
                    placeholder="Enter credits (min 10)"
                    value={customAmount}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700"
                  />
                  {customAmount && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                      = ${(parseInt(customAmount) / 10).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {effectiveAmount >= 10 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-300">Credits</span>
                    <span className="font-semibold text-white flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {effectiveAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Total</span>
                    <span className="text-xl font-bold text-amber-500">
                      ${priceUsd.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={effectiveAmount < 10 || loading}
                className={cn(
                  "w-full h-12 font-semibold text-base",
                  effectiveAmount >= 10
                    ? "bg-amber-500 hover:bg-amber-400 text-black"
                    : "bg-zinc-700 text-zinc-400"
                )}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    {effectiveAmount >= 10
                      ? `Pay $${priceUsd.toFixed(2)}`
                      : "Select amount"}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-zinc-500">
                Secure payment processing. Credits never expire.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
