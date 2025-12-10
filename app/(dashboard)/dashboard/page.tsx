"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/brand";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
} from "lucide-react";

// Mock data - in production this would come from API/database
const stats = [
  {
    title: "Total Photos",
    value: "24",
    change: "+3 this week",
    icon: ImageIcon,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Verified",
    value: "21",
    change: "87.5% rate",
    icon: CheckCircle,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Pending Review",
    value: "3",
    change: "~2 days avg",
    icon: Clock,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "License Requests",
    value: "8",
    change: "2 new today",
    icon: ShoppingBag,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
];

const recentPhotos = [
  {
    id: "1",
    title: "Golden Hour Mountains",
    src: "/images/seed/seed-landscape-01.webp",
    status: "VERIFIED",
    requests: 3,
  },
  {
    id: "2",
    title: "Urban Reflections",
    src: "/images/seed/seed-street-07.webp",
    status: "VERIFIED",
    requests: 1,
  },
  {
    id: "3",
    title: "Portrait Study",
    src: "/images/seed/seed-portrait-04.webp",
    status: "PENDING_REVIEW",
    requests: 0,
  },
  {
    id: "4",
    title: "Architectural Lines",
    src: "/images/seed/seed-architecture-09.webp",
    status: "VERIFIED",
    requests: 2,
  },
];

const recentRequests = [
  {
    id: "1",
    photo: "Golden Hour Mountains",
    buyer: "Creative Agency Inc.",
    license: "Commercial",
    status: "OPEN",
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    photo: "Urban Reflections",
    buyer: "Magazine Publisher",
    license: "Editorial",
    status: "IN_REVIEW",
    createdAt: "1 day ago",
  },
  {
    id: "3",
    photo: "Architectural Lines",
    buyer: "Design Studio",
    license: "Extended",
    status: "APPROVED",
    createdAt: "3 days ago",
  },
];

const statusColors = {
  VERIFIED: "status-verified",
  PENDING_REVIEW: "status-pending",
  REJECTED: "status-rejected",
  OPEN: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  IN_REVIEW: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  APPROVED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  DECLINED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
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
          <Link href="/integrations/telegram">
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
                      <p className="mt-2 text-3xl font-bold">{stat.value}</p>
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
                <div className="space-y-4">
                  {recentPhotos.map((photo) => (
                    <Link
                      key={photo.id}
                      href={`/dashboard/photos/${photo.id}`}
                      className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-white/5"
                    >
                      <div className="relative h-16 w-24 overflow-hidden rounded-lg">
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
                              statusColors[photo.status as keyof typeof statusColors]
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
                <Link
                  href="/dashboard/requests"
                  className="text-sm text-amber-400 hover:text-amber-300"
                >
                  View all
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <Link
                      key={request.id}
                      href={`/dashboard/requests/${request.id}`}
                      className="group flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate">{request.photo}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {request.buyer} • {request.license}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
                            statusColors[request.status as keyof typeof statusColors]
                          }`}
                        >
                          {request.status.replace("_", " ")}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {request.createdAt}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
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
