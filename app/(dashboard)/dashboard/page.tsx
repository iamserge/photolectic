"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Loader2,
} from "lucide-react";

interface DashboardData {
  stats: {
    totalPhotos: number;
    verifiedPhotos: number;
    pendingPhotos: number;
    licenseRequests: number;
    verificationRate: number;
    newRequestsToday: number;
    photosThisWeek: number;
  };
  recentPhotos: Array<{
    id: string;
    title: string;
    src: string;
    status: string;
    requests: number;
  }>;
  recentRequests: Array<{
    id: string;
    photo: string;
    buyer: string;
    license: string;
    status: string;
    createdAt: string;
  }>;
}

const statusColors: Record<string, string> = {
  VERIFIED: "status-verified",
  PENDING_REVIEW: "status-pending",
  REJECTED: "status-rejected",
  OPEN: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  IN_REVIEW: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  APPROVED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  DECLINED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Failed to load dashboard"}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Photos",
      value: data.stats.totalPhotos.toString(),
      change: `+${data.stats.photosThisWeek} this week`,
      icon: ImageIcon,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Verified",
      value: data.stats.verifiedPhotos.toString(),
      change: `${data.stats.verificationRate}% rate`,
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Pending Review",
      value: data.stats.pendingPhotos.toString(),
      change: "Awaiting review",
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "License Requests",
      value: data.stats.licenseRequests.toString(),
      change: `${data.stats.newRequestsToday} new today`,
      icon: ShoppingBag,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold uppercase">Dashboard</h1>
          <p className="mt-2 text-muted-foreground font-body">
            Welcome back! Here&apos;s an overview of your photography portfolio.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-4"
        >
          <Link href="/dashboard/photos/new">
            <Button className="gap-2 bg-amber-500 text-black hover:bg-amber-400">
              <Upload size={18} />
              Upload Photo
            </Button>
          </Link>
          <Link href="/dashboard/photos">
            <Button variant="outline" className="gap-2 border-white/20">
              <Camera size={18} />
              Manage Photos
            </Button>
          </Link>
          <Link href="/settings/telegram">
            <Button variant="outline" className="gap-2 border-white/20">
              <Zap size={18} />
              Connect Telegram
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card className="glass border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="mt-2 text-3xl font-display font-bold">{stat.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                      <stat.icon size={24} className={stat.color} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Photos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Recent Photos
                </CardTitle>
                <Link
                  href="/dashboard/photos"
                  className="text-sm text-amber-400 hover:text-amber-300"
                >
                  View all
                </Link>
              </CardHeader>
              <CardContent>
                {data.recentPhotos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No photos yet</p>
                    <Link href="/dashboard/photos/new" className="text-amber-400 text-sm hover:underline">
                      Upload your first photo
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.recentPhotos.map((photo) => (
                      <Link
                        key={photo.id}
                        href={`/gallery/${photo.id}`}
                        className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-white/5"
                      >
                        <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-zinc-800">
                          <Image
                            src={photo.src}
                            alt={photo.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="96px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{photo.title}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
                                statusColors[photo.status] || "bg-zinc-500/20 text-zinc-400"
                              }`}
                            >
                              {photo.status === "VERIFIED" && (
                                <CheckCircle size={10} className="mr-1" />
                              )}
                              {photo.status === "PENDING_REVIEW" && (
                                <Clock size={10} className="mr-1" />
                              )}
                              {photo.status.replace("_", " ")}
                            </span>
                            {photo.requests > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {photo.requests} requests
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  License Requests
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {data.recentRequests.length} pending
                </span>
              </CardHeader>
              <CardContent>
                {data.recentRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No license requests yet</p>
                    <p className="text-sm">Requests will appear here when buyers are interested</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.recentRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between rounded-lg p-2 bg-white/5"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{request.photo}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {request.buyer} &bull; {request.license}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
                              statusColors[request.status] || "bg-zinc-500/20 text-zinc-400"
                            }`}
                          >
                            {request.status.replace("_", " ")}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {request.createdAt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="glass border-amber-500/20 bg-amber-500/5">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-amber-500/20 p-3">
                <TrendingUp size={24} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Boost Your Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Photos with complete EXIF data and detailed descriptions get 3x
                  more license requests. Make sure to fill in all metadata!
                </p>
              </div>
              <Link href="/dashboard/photos">
                <Button variant="outline" size="sm" className="border-amber-500/30">
                  Review Photos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
