import { db } from "@/lib/db";
import { Suspense } from "react";
import {
  Image,
  Users,
  FileText,
  TrendingUp,
  Camera,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

async function getStats() {
  const [
    totalPhotos,
    pendingPhotos,
    verifiedPhotos,
    rejectedPhotos,
    totalUsers,
    totalPhotographers,
    totalBuyers,
    openRequests,
    recentPhotos,
    recentUsers,
  ] = await Promise.all([
    db.photo.count(),
    db.photo.count({ where: { status: "PENDING_REVIEW" } }),
    db.photo.count({ where: { status: "VERIFIED" } }),
    db.photo.count({ where: { status: "REJECTED" } }),
    db.user.count(),
    db.user.count({ where: { roles: { has: "PHOTOGRAPHER" } } }),
    db.user.count({ where: { roles: { has: "BUYER" } } }),
    db.licenseRequest.count({ where: { status: "OPEN" } }),
    db.photo.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { photographer: true },
    }),
    db.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    totalPhotos,
    pendingPhotos,
    verifiedPhotos,
    rejectedPhotos,
    totalUsers,
    totalPhotographers,
    totalBuyers,
    openRequests,
    recentPhotos,
    recentUsers,
  };
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = "default",
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "warning" | "success" | "danger";
}) {
  const variantStyles = {
    default: "border-zinc-800 bg-zinc-900/50",
    warning: "border-amber-500/30 bg-amber-500/5",
    success: "border-emerald-500/30 bg-emerald-500/5",
    danger: "border-red-500/30 bg-red-500/5",
  };

  const iconStyles = {
    default: "text-zinc-400",
    warning: "text-amber-500",
    success: "text-emerald-500",
    danger: "text-red-500",
  };

  return (
    <div className={`rounded-2xl border p-6 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className={`w-4 h-4 ${trend >= 0 ? "text-emerald-500" : "text-red-500"}`} />
              <span className={`text-sm ${trend >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {trend >= 0 ? "+" : ""}{trend}%
              </span>
              {trendLabel && <span className="text-xs text-zinc-500 ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-zinc-800/50 ${iconStyles[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  type,
  title,
  description,
  time,
  status,
}: {
  type: "photo" | "user" | "license";
  title: string;
  description: string;
  time: string;
  status?: "pending" | "verified" | "rejected";
}) {
  const icons = {
    photo: Image,
    user: Users,
    license: FileText,
  };
  const Icon = icons[type];

  const statusColors = {
    pending: "text-amber-500 bg-amber-500/10",
    verified: "text-emerald-500 bg-emerald-500/10",
    rejected: "text-red-500 bg-red-500/10",
  };

  const statusIcons = {
    pending: Clock,
    verified: CheckCircle,
    rejected: XCircle,
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-zinc-800/30 transition-colors">
      <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{title}</p>
        <p className="text-sm text-zinc-500 truncate">{description}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-zinc-500">{time}</span>
        {status && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${statusColors[status]}`}>
            {(() => {
              const StatusIcon = statusIcons[status];
              return <StatusIcon className="w-3 h-3" />;
            })()}
            <span className="text-xs capitalize">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}

async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/20 p-8">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back, Admin
          </h2>
          <p className="text-zinc-400 max-w-lg">
            You have <span className="text-amber-500 font-semibold">{stats.pendingPhotos} photos</span> pending review
            and <span className="text-amber-500 font-semibold">{stats.openRequests} license requests</span> waiting for approval.
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <Camera className="w-32 h-32 text-amber-500" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Photos"
          value={stats.totalPhotos}
          icon={Image}
          trend={12}
          trendLabel="vs last month"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingPhotos}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Verified Photos"
          value={stats.verifiedPhotos}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Rejected"
          value={stats.rejectedPhotos}
          icon={XCircle}
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
        />
        <StatCard
          title="Photographers"
          value={stats.totalPhotographers}
          icon={Camera}
        />
        <StatCard
          title="Open Requests"
          value={stats.openRequests}
          icon={FileText}
          variant="warning"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Photos */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <h3 className="text-lg font-semibold text-white">Recent Uploads</h3>
            <a
              href="/admin/photos"
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
            >
              View all
            </a>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {stats.recentPhotos.map((photo) => (
              <ActivityItem
                key={photo.id}
                type="photo"
                title={photo.title}
                description={`By ${photo.photographer.name || photo.photographer.email}`}
                time={new Date(photo.createdAt).toLocaleDateString()}
                status={
                  photo.status === "PENDING_REVIEW"
                    ? "pending"
                    : photo.status === "VERIFIED"
                    ? "verified"
                    : "rejected"
                }
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/photos?status=pending"
              className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 transition-colors"
            >
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Review Pending Photos</p>
                <p className="text-xs text-amber-500/70">{stats.pendingPhotos} photos waiting</p>
              </div>
            </a>
            <a
              href="/admin/licenses"
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white hover:bg-zinc-800 transition-colors"
            >
              <FileText className="w-5 h-5" />
              <div>
                <p className="font-medium">License Requests</p>
                <p className="text-xs text-zinc-500">{stats.openRequests} open requests</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white hover:bg-zinc-800 transition-colors"
            >
              <Users className="w-5 h-5" />
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-xs text-zinc-500">{stats.totalUsers} total users</p>
              </div>
            </a>
          </div>

          {/* Recent Users */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <h4 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">New Users</h4>
            <div className="space-y-2">
              {stats.recentUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{user.name || user.email}</p>
                    <p className="text-xs text-zinc-500">{user.roles.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[50vh]">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}
