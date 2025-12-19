"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Coins,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingCart,
  Gift,
  Loader2,
} from "lucide-react";
import { WalletBalance } from "@/components/wallet";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  createdAt: string;
  type: string;
  amount: number;
  balance: number;
  description: string | null;
}

interface WalletData {
  balance: number;
  totalSpent: number;
  totalEarnings: number;
  recentTransactions: Transaction[];
}

const transactionIcons: Record<string, typeof Coins> = {
  CREDIT_PURCHASE: ArrowUpRight,
  PHOTO_PURCHASE: ShoppingCart,
  PHOTOGRAPHER_EARNING: TrendingUp,
  REFUND: ArrowDownLeft,
  BONUS: Gift,
};

const transactionColors: Record<string, string> = {
  CREDIT_PURCHASE: "text-emerald-500",
  PHOTO_PURCHASE: "text-red-400",
  PHOTOGRAPHER_EARNING: "text-emerald-500",
  REFUND: "text-amber-500",
  BONUS: "text-purple-500",
};

export default function WalletPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      try {
        const res = await fetch("/api/wallet");
        if (res.ok) {
          const data = await res.json();
          setWalletData(data);
        }
      } catch (error) {
        console.error("Failed to fetch wallet:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWallet();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Wallet</h1>
        <p className="text-zinc-400 mt-1">Manage your credits and view transaction history</p>
      </div>

      {/* Balance Card */}
      <WalletBalance variant="full" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Coins className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Current Balance</p>
              <p className="text-2xl font-bold text-white">
                {walletData?.balance.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <ShoppingCart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Spent</p>
              <p className="text-2xl font-bold text-white">
                {walletData?.totalSpent.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Earnings</p>
              <p className="text-2xl font-bold text-white">
                {walletData?.totalEarnings.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {walletData?.recentTransactions && walletData.recentTransactions.length > 0 ? (
            walletData.recentTransactions.map((tx, index) => {
              const Icon = transactionIcons[tx.type] || Coins;
              const colorClass = transactionColors[tx.type] || "text-zinc-400";

              return (
                <motion.div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-lg bg-zinc-800", colorClass)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {tx.description || tx.type.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-bold",
                      tx.amount > 0 ? "text-emerald-500" : "text-red-400"
                    )}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-zinc-500">
                      Balance: {tx.balance.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Coins className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No transactions yet</p>
              <p className="text-sm text-zinc-500">Add credits to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
