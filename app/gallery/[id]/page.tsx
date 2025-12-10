import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  Camera,
  Aperture,
  Clock,
  Calendar,
  MapPin,
  User,
  Tag,
  ArrowLeft,
  Heart,
  Share2,
  Download,
  Shield,
  CheckCircle,
} from "lucide-react";
import { VerifiedBadge } from "@/components/brand/verified-badge";

async function getPhoto(id: string) {
  const photo = await db.photo.findUnique({
    where: { id, status: "VERIFIED" },
    include: {
      photographer: {
        include: {
          photographerProfile: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      licenseOptions: {
        where: { isActive: true },
        orderBy: { priceCents: "asc" },
      },
    },
  });

  return photo;
}

async function getSimilarPhotos(photoId: string, photographerId: string) {
  const photos = await db.photo.findMany({
    where: {
      status: "VERIFIED",
      id: { not: photoId },
      photographerId,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return photos;
}

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [photo, session] = await Promise.all([
    getPhoto(id),
    auth(),
  ]);

  if (!photo) {
    notFound();
  }

  const similarPhotos = await getSimilarPhotos(id, photo.photographerId);

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Back Navigation */}
      <div className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/gallery"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Gallery</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <Image
                src={photo.fileUrl}
                alt={photo.title}
                fill
                className="object-contain"
                priority
              />
              <VerifiedBadge variant="verified" className="absolute top-4 left-4" />
            </div>

            {/* Technical Details */}
            <div className="mt-6 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Technical Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photo.cameraMake && (
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-zinc-500" />
                    <div>
                      <p className="text-xs text-zinc-500">Camera</p>
                      <p className="text-sm text-white">{photo.cameraMake} {photo.cameraModel}</p>
                    </div>
                  </div>
                )}
                {photo.aperture && (
                  <div className="flex items-center gap-2">
                    <Aperture className="w-4 h-4 text-zinc-500" />
                    <div>
                      <p className="text-xs text-zinc-500">Aperture</p>
                      <p className="text-sm text-white">f/{photo.aperture}</p>
                    </div>
                  </div>
                )}
                {photo.shutterSpeed && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <div>
                      <p className="text-xs text-zinc-500">Shutter</p>
                      <p className="text-sm text-white">{photo.shutterSpeed}s</p>
                    </div>
                  </div>
                )}
                {photo.iso && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-bold">ISO</span>
                    <div>
                      <p className="text-xs text-zinc-500">ISO</p>
                      <p className="text-sm text-white">{photo.iso}</p>
                    </div>
                  </div>
                )}
                {photo.focalLength && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">mm</span>
                    <div>
                      <p className="text-xs text-zinc-500">Focal Length</p>
                      <p className="text-sm text-white">{photo.focalLength}</p>
                    </div>
                  </div>
                )}
                {photo.width && photo.height && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">px</span>
                    <div>
                      <p className="text-xs text-zinc-500">Resolution</p>
                      <p className="text-sm text-white">{photo.width} x {photo.height}</p>
                    </div>
                  </div>
                )}
                {photo.shootDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <div>
                      <p className="text-xs text-zinc-500">Shot Date</p>
                      <p className="text-sm text-white">
                        {new Date(photo.shootDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {photo.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map((pt) => (
                    <Link
                      key={pt.tag.id}
                      href={`/gallery?tag=${pt.tag.slug}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {pt.tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo Info */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h1 className="text-2xl font-bold text-white">{photo.title}</h1>
              {photo.description && (
                <p className="mt-3 text-zinc-400">{photo.description}</p>
              )}
              <p className="mt-4 text-sm text-zinc-500">
                Uploaded {new Date(photo.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Photographer */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-4">Photographer</h3>
              <Link
                href={`/photographer/${photo.photographer.photographerProfile?.handle}`}
                className="flex items-center gap-4 group"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center overflow-hidden">
                    {photo.photographer.photographerProfile?.avatarUrl ? (
                      <Image
                        src={photo.photographer.photographerProfile.avatarUrl}
                        alt=""
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-black">
                        {(photo.photographer.name || photo.photographer.email)[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  {photo.photographer.photographerProfile?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold group-hover:text-amber-500 transition-colors">
                    {photo.photographer.photographerProfile?.displayName || photo.photographer.name}
                  </p>
                  <p className="text-sm text-zinc-500">
                    @{photo.photographer.photographerProfile?.handle || "photographer"}
                  </p>
                </div>
              </Link>
              {photo.photographer.photographerProfile?.bio && (
                <p className="mt-4 text-sm text-zinc-400 line-clamp-3">
                  {photo.photographer.photographerProfile.bio}
                </p>
              )}
            </div>

            {/* Licensing Options */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-white">License This Photo</h3>
              </div>
              <div className="space-y-3">
                {photo.licenseOptions.map((option) => (
                  <div
                    key={option.id}
                    className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{option.name}</h4>
                      <span className="text-lg font-bold text-emerald-400">
                        {formatPrice(option.priceCents, option.currency)}
                      </span>
                    </div>
                    {option.description && (
                      <p className="text-sm text-zinc-400 mb-3">{option.description}</p>
                    )}
                    <button className="w-full py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors">
                      Request License
                    </button>
                  </div>
                ))}
              </div>
              {photo.licenseOptions.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-zinc-500">Contact photographer for licensing</p>
                  <button className="mt-3 px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors">
                    Contact Photographer
                  </button>
                </div>
              )}
            </div>

            {/* Verification Badge */}
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Verified Authentic</h4>
                  <p className="text-sm text-zinc-400 mt-1">
                    This photo has been verified by our team as an authentic, human-created photograph.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More from this photographer */}
        {similarPhotos.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              More from {photo.photographer.photographerProfile?.displayName || photo.photographer.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarPhotos.map((p) => (
                <Link
                  key={p.id}
                  href={`/gallery/${p.id}`}
                  className="group relative aspect-square rounded-xl overflow-hidden"
                >
                  <Image
                    src={p.thumbnailUrl || p.fileUrl}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium truncate">{p.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
