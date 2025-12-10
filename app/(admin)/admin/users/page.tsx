"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Camera,
  ShoppingBag,
  Shield,
  MoreVertical,
  Mail,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Send,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  roles: string[];
  createdAt: string;
  telegramUserId: string | null;
  telegramUsername: string | null;
  _count: {
    photos: number;
    licenseRequests: number;
  };
  photographerProfile: {
    displayName: string;
    handle: string;
    isVerified: boolean;
  } | null;
}

const roleFilters = [
  { value: "all", label: "All Users", icon: Users },
  { value: "PHOTOGRAPHER", label: "Photographers", icon: Camera },
  { value: "BUYER", label: "Buyers", icon: ShoppingBag },
  { value: "ADMIN", label: "Admins", icon: Shield },
];

function UserCard({ user }: { user: User }) {
  const [showMenu, setShowMenu] = useState(false);

  const roleColors = {
    ADMIN: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    PHOTOGRAPHER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    BUYER: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center overflow-hidden">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || ""}
                width={56}
                height={56}
                className="object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {(user.name || user.email)[0].toUpperCase()}
              </span>
            )}
          </div>
          {user.photographerProfile?.isVerified && (
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold truncate">
              {user.name || "Unnamed User"}
            </h3>
            {user.telegramUsername && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs">
                <Send className="w-3 h-3" />
                @{user.telegramUsername}
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500 truncate">{user.email}</p>
          {user.photographerProfile && (
            <p className="text-sm text-zinc-400 mt-1">
              @{user.photographerProfile.handle}
            </p>
          )}

          {/* Roles */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.roles.map((role) => (
              <span
                key={role}
                className={`px-2 py-0.5 rounded-full border text-xs font-medium ${
                  roleColors[role as keyof typeof roleColors] || "bg-zinc-800 text-zinc-400"
                }`}
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 py-2 rounded-xl bg-zinc-800 border border-zinc-700 shadow-xl z-10">
              <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-700 transition-colors">
                View Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-700 transition-colors">
                Send Message
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-700 transition-colors">
                Edit Roles
              </button>
              <div className="my-1 border-t border-zinc-700" />
              <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-700 transition-colors">
                Suspend User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-zinc-800">
        <div className="text-center">
          <p className="text-lg font-bold text-white">{user._count.photos}</p>
          <p className="text-xs text-zinc-500">Photos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">{user._count.licenseRequests}</p>
          <p className="text-xs text-zinc-500">Requests</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
          </p>
          <p className="text-xs text-zinc-500">Joined</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== "all") {
        params.append("role", roleFilter);
      }
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    photographers: users.filter((u) => u.roles.includes("PHOTOGRAPHER")).length,
    buyers: users.filter((u) => u.roles.includes("BUYER")).length,
    verified: users.filter((u) => u.photographerProfile?.isVerified).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-zinc-500">Manage photographers, buyers, and admins</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-64"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-zinc-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.photographers}</p>
              <p className="text-xs text-zinc-500">Photographers</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.buyers}</p>
              <p className="text-xs text-zinc-500">Buyers</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.verified}</p>
              <p className="text-xs text-zinc-500">Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-800/50 rounded-xl w-fit">
        {roleFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setRoleFilter(filter.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              roleFilter === filter.value
                ? "bg-amber-500 text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <filter.icon className="w-4 h-4" />
            {filter.label}
          </button>
        ))}
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Users className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-semibold text-white">No users found</h3>
          <p className="text-zinc-500 mt-1">No users match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
