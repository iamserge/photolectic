"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  DollarSign,
  User,
  Image as ImageIcon,
  Send,
  ChevronRight,
} from "lucide-react";

interface LicenseRequest {
  id: string;
  status: "OPEN" | "IN_REVIEW" | "APPROVED" | "DECLINED" | "COMPLETED";
  message: string | null;
  intendedUse: string | null;
  createdAt: string;
  photo: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    fileUrl: string;
  };
  buyer: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  licenseOption: {
    id: string;
    name: string;
    type: string;
    priceCents: number;
    currency: string;
  } | null;
}

const statusFilters = [
  { value: "all", label: "All Requests" },
  { value: "OPEN", label: "Open" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "DECLINED", label: "Declined" },
];

function RequestCard({
  request,
  onSelect,
}: {
  request: LicenseRequest;
  onSelect: () => void;
}) {
  const statusStyles = {
    OPEN: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    IN_REVIEW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    APPROVED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    DECLINED: "bg-red-500/20 text-red-400 border-red-500/30",
    COMPLETED: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  };

  const statusIcons = {
    OPEN: Clock,
    IN_REVIEW: Eye,
    APPROVED: CheckCircle,
    DECLINED: XCircle,
    COMPLETED: CheckCircle,
  };

  const StatusIcon = statusIcons[request.status];

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(cents / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex gap-4">
        {/* Photo Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={request.photo.thumbnailUrl || request.photo.fileUrl}
            alt={request.photo.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold truncate">{request.photo.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center overflow-hidden">
                  {request.buyer.image ? (
                    <Image
                      src={request.buyer.image}
                      alt=""
                      width={20}
                      height={20}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[8px] font-bold text-white">
                      {(request.buyer.name || request.buyer.email)[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm text-zinc-400 truncate">
                  {request.buyer.name || request.buyer.email}
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium ${statusStyles[request.status]}`}>
              <StatusIcon className="w-3 h-3" />
              <span className="capitalize">{request.status.replace("_", " ").toLowerCase()}</span>
            </div>
          </div>

          {/* License & Price */}
          {request.licenseOption && (
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-sm text-zinc-400">
                <FileText className="w-4 h-4" />
                {request.licenseOption.name}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                <DollarSign className="w-4 h-4" />
                {formatPrice(request.licenseOption.priceCents, request.licenseOption.currency)}
              </span>
            </div>
          )}

          {/* Message Preview */}
          {request.message && (
            <p className="mt-2 text-sm text-zinc-500 truncate">
              "{request.message}"
            </p>
          )}

          {/* Date */}
          <p className="mt-2 text-xs text-zinc-600">
            {new Date(request.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <ChevronRight className="w-5 h-5 text-zinc-600 self-center" />
      </div>
    </motion.div>
  );
}

function RequestDetailModal({
  request,
  onClose,
  onApprove,
  onDecline,
}: {
  request: LicenseRequest;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(cents / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={request.photo.fileUrl}
            alt={request.photo.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-xl font-bold text-white">{request.photo.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Buyer Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center overflow-hidden">
              {request.buyer.image ? (
                <Image
                  src={request.buyer.image}
                  alt=""
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-white">
                  {(request.buyer.name || request.buyer.email)[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-white font-semibold">{request.buyer.name || "Unknown Buyer"}</p>
              <p className="text-sm text-zinc-500">{request.buyer.email}</p>
            </div>
          </div>

          {/* License Details */}
          {request.licenseOption && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-2">License Request</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{request.licenseOption.name}</p>
                  <p className="text-sm text-zinc-400">{request.licenseOption.type} License</p>
                </div>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatPrice(request.licenseOption.priceCents, request.licenseOption.currency)}
                </p>
              </div>
            </div>
          )}

          {/* Message */}
          {request.message && (
            <div>
              <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Message from Buyer</h3>
              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <p className="text-white whitespace-pre-wrap">{request.message}</p>
              </div>
            </div>
          )}

          {/* Intended Use */}
          {request.intendedUse && (
            <div>
              <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Intended Use</h3>
              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <p className="text-white whitespace-pre-wrap">{request.intendedUse}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {request.status === "OPEN" || request.status === "IN_REVIEW" ? (
            <div className="flex gap-4 pt-4 border-t border-zinc-800">
              <button
                onClick={() => onDecline(request.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Decline</span>
              </button>
              <button
                onClick={() => onApprove(request.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Approve</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-zinc-800">
              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LicensesPage() {
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LicenseRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState("OPEN");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      const res = await fetch(`/api/admin/licenses?${params}`);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/admin/licenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await fetch(`/api/admin/licenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DECLINED" }),
      });
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error("Failed to decline:", error);
    }
  };

  const filteredRequests = requests.filter((req) =>
    req.photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.buyer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">License Requests</h1>
          <p className="text-zinc-500">Review and manage photo licensing requests</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-64"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-800/50 rounded-xl w-fit overflow-x-auto">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === filter.value
                ? "bg-amber-500 text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FileText className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-semibold text-white">No requests found</h3>
          <p className="text-zinc-500 mt-1">
            {statusFilter === "OPEN"
              ? "No open license requests at the moment."
              : "No requests match your current filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onSelect={() => setSelectedRequest(request)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <RequestDetailModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
