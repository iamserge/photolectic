"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  BarChart3,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Photo Review",
    href: "/admin/photos",
    icon: Image,
    badge: "12",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "License Requests",
    href: "/admin/licenses",
    icon: FileText,
    badge: "3",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 80 }}
          className="fixed left-0 top-0 z-40 h-screen bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800"
        >
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
            <Link href="/admin" className="flex items-center gap-3">
              <Logo size="sm" variant="icon" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col"
                  >
                    <span className="text-white font-bold text-lg">Photolectic</span>
                    <span className="text-amber-500 text-xs font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Admin Panel
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {sidebarOpen ? (
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              ) : (
                <Menu className="w-5 h-5 text-zinc-400" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-amber-500" : ""}`} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {sidebarOpen && item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-black rounded-full"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats (when expanded) */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-20 left-4 right-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50"
              >
                <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Quick Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-zinc-400">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Pending Review
                    </span>
                    <span className="text-white font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-zinc-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Verified Today
                    </span>
                    <span className="text-white font-semibold">28</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <span className="text-black font-bold">A</span>
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <p className="text-white font-medium text-sm">Admin User</p>
                    <p className="text-zinc-500 text-xs">Super Admin</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {sidebarOpen && (
                <button className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-[280px]" : "ml-[80px]"
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">
              {navItems.find(item => item.href === pathname)?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            </button>
            <div className="h-8 w-px bg-zinc-800" />
            <span className="text-sm text-zinc-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
