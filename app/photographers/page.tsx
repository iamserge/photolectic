import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { VerifiedBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Camera, MapPin, Images, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Photographers",
  description: "Discover talented photographers on Photolectic. Every creator verified, every image authentic.",
};

async function getPhotographers() {
  const photographers = await db.user.findMany({
    where: {
      roles: { has: "PHOTOGRAPHER" },
      photographerProfile: {
        isNot: null,
      },
    },
    include: {
      photographerProfile: true,
      photos: {
        where: { status: "VERIFIED" },
        take: 4,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          photos: {
            where: { status: "VERIFIED" },
          },
        },
      },
    },
    take: 20,
  });
  return photographers;
}

export default async function PhotographersPage() {
  const photographers = await getPhotographers();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              Meet Our <span className="gradient-text">Photographers</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-light">
              Talented creators from around the world, each verified and celebrated
              for their authentic human-made photography.
            </p>
          </div>
        </div>
      </section>

      {/* Photographers Grid */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {photographers.map((photographer) => (
              <Link
                key={photographer.id}
                href={`/photographer/${photographer.photographerProfile?.handle || photographer.id}`}
                className="group"
              >
                <div className="stat-card hover:scale-[1.02] transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted">
                      {photographer.image ? (
                        <Image
                          src={photographer.image}
                          alt={photographer.name || "Photographer"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-amber-500/20 text-amber-400 text-xl font-bold">
                          {photographer.name?.charAt(0) || "P"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold group-hover:text-amber-400 transition-colors">
                          {photographer.photographerProfile?.displayName || photographer.name}
                        </h3>
                        <VerifiedBadge size="sm" showLabel={false} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        @{photographer.photographerProfile?.handle || "photographer"}
                      </p>
                      {photographer.photographerProfile?.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin size={12} />
                          {photographer.photographerProfile.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {photographer.photographerProfile?.bio && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {photographer.photographerProfile.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Images size={14} className="text-amber-400" />
                      {photographer._count.photos} photos
                    </span>
                  </div>

                  {/* Photo Preview */}
                  {photographer.photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-1 rounded-lg overflow-hidden">
                      {photographer.photos.slice(0, 4).map((photo, i) => (
                        <div key={photo.id} className="aspect-square relative">
                          <Image
                            src={photo.thumbnailUrl || photo.fileUrl}
                            alt={photo.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {photographers.length === 0 && (
            <div className="text-center py-20">
              <Camera size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No photographers yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to join our community!</p>
              <Link href="/register?role=photographer">
                <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
                  Become a Photographer
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-black/30 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to showcase your work?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join our community of verified photographers and start earning from your authentic photography.
          </p>
          <Link href="/register?role=photographer">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold gap-2">
              <Camera size={20} />
              Join as Photographer
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
