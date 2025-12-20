import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Eye, Users, Heart, Globe, Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Photolectic's mission to bring authenticity back to photography in an AI-saturated world.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Authenticity First",
    description: "Every photo on our platform is verified as genuine human-made photography with real camera metadata.",
  },
  {
    icon: Eye,
    title: "Complete Transparency",
    description: "Full EXIF data, timestamps, and creation details are preserved and displayed for every image.",
  },
  {
    icon: Users,
    title: "Creator Empowerment",
    description: "Photographers keep 80% of earnings. We believe in fair compensation for creative work.",
  },
  {
    icon: Heart,
    title: "Quality Over Quantity",
    description: "We curate and verify every submission to maintain the highest standards of photographic excellence.",
  },
];

const stats = [
  { value: "2024", label: "Founded" },
  { value: "100+", label: "Countries" },
  { value: "80%", label: "Creator Revenue" },
  { value: "100%", label: "Human-Made" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Logo size="xl" variant="icon" className="mx-auto mb-8" />
            <h1 className="text-5xl font-display font-bold uppercase tracking-tight sm:text-6xl">
              Bringing <span className="gradient-text">Authenticity</span> Back
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground font-body font-light leading-relaxed">
              In a world where AI-generated images are becoming indistinguishable from reality,
              Photolectic stands as a beacon of authenticity. We verify and celebrate
              genuine human-made photography.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold uppercase mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Photolectic was born from a simple observation: as AI-generated imagery floods
                the internet, the value of authentic human photography has never been higher.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We&apos;re building the world&apos;s most trusted marketplace for verified human photography.
                Every image on our platform comes with complete metadata transparency, proving its
                authenticity and celebrating the human behind the lens.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our rigorous verification process examines EXIF data, camera signatures, and
                creation patterns to ensure every photo is genuinely captured, not generated.
              </p>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/images/seed/seed-portrait-04.webp"
                alt="Authentic human photography"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-sm text-amber-400 font-medium mb-1">Verified Human Photography</p>
                <p className="text-white font-bold">Every image tells a real story</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-black/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-display font-bold text-amber-400 md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold uppercase mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at Photolectic.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="stat-card">
                <div className="inline-flex rounded-xl bg-amber-500/10 p-3 text-amber-400 mb-4">
                  <value.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-white/5 bg-black/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold uppercase mb-4">Built by Photographers, for Photographers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team combines decades of photography experience with deep expertise in
              technology, AI detection, and marketplace design.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
            {[
              { role: "Photography", icon: Camera },
              { role: "Technology", icon: Globe },
              { role: "Community", icon: Users },
            ].map((item) => (
              <div key={item.role} className="text-center">
                <div className="inline-flex rounded-full bg-amber-500/10 p-4 text-amber-400 mb-4">
                  <item.icon size={32} />
                </div>
                <h3 className="font-bold">{item.role}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-display font-bold uppercase mb-4">
            Join the Authenticity Movement
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a photographer looking to showcase your work or a buyer
            seeking genuine imagery, we&apos;d love to have you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=photographer">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
                Join as Photographer
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                Browse Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
