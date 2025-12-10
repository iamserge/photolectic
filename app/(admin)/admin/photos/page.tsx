"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Camera,
  Calendar,
  MapPin,
  User,
  Aperture,
  Maximize2,
  X,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  status: "UPLOADING" | "PENDING_REVIEW" | "VERIFIED" | "REJECTED";
  createdAt: string;
  width: number | null;
  height: number | null;
  cameraMake: string | null;
  cameraModel: string | null;
  aperture: string | null;
  shutterSpeed: string | null;
  iso: number | null;
  focalLength: string | null;
  photographer: {
    id: string;
    name: string | null;
    email: string;
    photographerProfile: {
      displayName: string;
      handle: string;
      avatarUrl: string | null;
    } | null;
  };
}

const statusFilters = [
  { value: "all", label: "All Photos" },
  { value: "PENDING_REVIEW", label: "Pending Review" },
  { value: "VERIFIED", label: "Verified" },
  { value: "REJECTED", label: "Rejected" },
];

function PhotoCard({
  photo,
  onSelect,
}: {
  photo: Photo;
  onSelect: () => void;
}) {
  const statusStyles = {
    UPLOADING: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    PENDING_REVIEW: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    VERIFIED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const statusIcons = {
    UPLOADING: Clock,
    PENDING_REVIEW: Clock,
    VERIFIED: CheckCircle,
    REJECTED: XCircle,
  };

  const StatusIcon = statusIcons[photo.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={photo.thumbnailUrl || photo.fileUrl}
          alt={photo.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onSelect}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={onSelect}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium ${statusStyles[photo.status]}`}>
        <StatusIcon className="w-3 h-3" />
        <span className="capitalize">{photo.status.replace("_", " ").toLowerCase()}</span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{photo.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center overflow-hidden">
            {photo.photographer.photographerProfile?.avatarUrl ? (
              <Image
                src={photo.photographer.photographerProfile.avatarUrl}
                alt=""
                width={24}
                height={24}
                className="object-cover"
              />
            ) : (
              <span className="text-[10px] font-bold text-white">
                {(photo.photographer.name || photo.photographer.email)[0].toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-sm text-zinc-400 truncate">
            {photo.photographer.photographerProfile?.displayName || photo.photographer.name || photo.photographer.email}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(photo.createdAt).toLocaleDateString()}
          </span>
          {photo.cameraMake && (
            <span className="flex items-center gap-1">
              <Camera className="w-3 h-3" />
              {photo.cameraMake}
            </span>
          )}
        </div>
      </div>

      {/* Review Button for Pending */}
      {photo.status === "PENDING_REVIEW" && (
        <div className="p-4 pt-0">
          <button
            onClick={onSelect}
            className="w-full py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors"
          >
            Review Now
          </button>
        </div>
      )}
    </motion.div>
  );
}

function PhotoReviewModal({
  photo,
  onClose,
  onVerify,
  onReject,
}: {
  photo: Photo;
  onClose: () => void;
  onVerify: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
}) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    setIsSubmitting(true);
    await onVerify(photo.id, notes);
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    await onReject(photo.id, notes);
    setIsSubmitting(false);
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
        className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative aspect-square lg:aspect-auto bg-black">
            <Image
              src={photo.fileUrl}
              alt={photo.title}
              fill
              className="object-contain"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info & Actions Section */}
          <div className="flex flex-col h-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-2xl font-bold text-white">{photo.title}</h2>
              {photo.description && (
                <p className="mt-2 text-zinc-400">{photo.description}</p>
              )}
            </div>

            {/* Photographer Info */}
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">Photographer</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <span className="text-black font-bold">
                    {(photo.photographer.name || photo.photographer.email)[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {photo.photographer.photographerProfile?.displayName || photo.photographer.name || "Unknown"}
                  </p>
                  <p className="text-sm text-zinc-500">{photo.photographer.email}</p>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">Technical Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {photo.cameraMake && (
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="w-4 h-4 text-zinc-500" />
                    <span className="text-white">{photo.cameraMake} {photo.cameraModel}</span>
                  </div>
                )}
                {photo.aperture && (
                  <div className="flex items-center gap-2 text-sm">
                    <Aperture className="w-4 h-4 text-zinc-500" />
                    <span className="text-white">f/{photo.aperture}</span>
                  </div>
                )}
                {photo.shutterSpeed && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <span className="text-white">{photo.shutterSpeed}s</span>
                  </div>
                )}
                {photo.iso && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-500 text-xs">ISO</span>
                    <span className="text-white">{photo.iso}</span>
                  </div>
                )}
                {photo.width && photo.height && (
                  <div className="flex items-center gap-2 text-sm">
                    <Maximize2 className="w-4 h-4 text-zinc-500" />
                    <span className="text-white">{photo.width} x {photo.height}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Review Section */}
            <div className="flex-1 p-6">
              <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">Review Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about your decision (optional)..."
                className="w-full h-32 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
              <div className="flex gap-4">
                <button
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">Reject</span>
                </button>
                <button
                  onClick={handleVerify}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PhotoReviewPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [statusFilter, setStatusFilter] = useState("PENDING_REVIEW");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPhotos();
  }, [statusFilter]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      const res = await fetch(`/api/admin/photos?${params}`);
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    }
    setLoading(false);
  };

  const handleVerify = async (id: string, notes: string) => {
    try {
      await fetch(`/api/admin/photos/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision: "VERIFIED", notes }),
      });
      setSelectedPhoto(null);
      fetchPhotos();
    } catch (error) {
      console.error("Failed to verify photo:", error);
    }
  };

  const handleReject = async (id: string, notes: string) => {
    try {
      await fetch(`/api/admin/photos/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision: "REJECTED", notes }),
      });
      setSelectedPhoto(null);
      fetchPhotos();
    } catch (error) {
      console.error("Failed to reject photo:", error);
    }
  };

  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.photographer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.photographer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Photo Review</h1>
          <p className="text-zinc-500">Verify and moderate uploaded photos</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-64"
            />
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-800/50 rounded-xl w-fit">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === filter.value
                ? "bg-amber-500 text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Camera className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-semibold text-white">No photos found</h3>
          <p className="text-zinc-500 mt-1">
            {statusFilter === "PENDING_REVIEW"
              ? "All caught up! No photos pending review."
              : "No photos match your current filters."}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onSelect={() => setSelectedPhoto(photo)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoReviewModal
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
            onVerify={handleVerify}
            onReject={handleReject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
