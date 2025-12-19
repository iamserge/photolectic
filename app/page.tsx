"use client";

import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Header, Footer } from "@/components/layout";
import { Logo, VerifiedBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  Camera,
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  Eye,
  Lock,
  Award,
  Upload,
  Search,
  Download,
  CheckCircle,
  Coins,
} from "lucide-react";

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return { count, nodeRef };
}

// Dynamically import Three.js component to avoid SSR issues
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-32 w-32 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />
    </div>
  ),
});

// Featured photos from our generated seed images
const featuredPhotos = [
  { src: "/images/seed/seed-landscape-01.webp", category: "Landscape", photographer: "Alex Rivers" },
  { src: "/images/seed/seed-portrait-04.webp", category: "Portrait", photographer: "Maya Chen" },
  { src: "/images/seed/seed-street-07.webp", category: "Street", photographer: "Kai Tanaka" },
  { src: "/images/seed/seed-architecture-09.webp", category: "Architecture", photographer: "Lena Schmidt" },
  { src: "/images/seed/seed-wildlife-11.webp", category: "Wildlife", photographer: "Marcus Webb" },
  { src: "/images/seed/seed-travel-17.webp", category: "Travel", photographer: "Sofia Reyes" },
  { src: "/images/seed/seed-urban-19.webp", category: "Urban", photographer: "James Liu" },
  { src: "/images/seed/seed-food-13.webp", category: "Food", photographer: "Emma Blanc" },
];

// Marquee photos - more for the infinite scroll effect
const marqueePhotos = [
  "/images/seed/seed-landscape-01.webp",
  "/images/seed/seed-portrait-04.webp",
  "/images/seed/seed-street-07.webp",
  "/images/seed/seed-architecture-09.webp",
  "/images/seed/seed-wildlife-11.webp",
  "/images/seed/seed-travel-17.webp",
  "/images/seed/seed-urban-19.webp",
  "/images/seed/seed-food-13.webp",
  "/images/seed/seed-landscape-02.webp",
  "/images/seed/seed-portrait-05.webp",
  "/images/seed/seed-abstract-15.webp",
  "/images/seed/seed-abstract-16.webp",
];

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  decimal?: boolean;
}

const stats: StatItem[] = [
  { value: 50000, suffix: "+", label: "Verified Photos" },
  { value: 2500, suffix: "+", label: "Photographers" },
  { value: 99.9, suffix: "%", label: "Authenticity Rate", decimal: true },
  { value: 100, suffix: "+", label: "Countries" },
];

const howItWorks = [
  {
    icon: Upload,
    title: "Upload Your Work",
    description: "Photographers upload their authentic photos with full EXIF metadata preserved.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: ShieldCheck,
    title: "AI Verification",
    description: "Our system verifies authenticity, analyzes metadata, and auto-generates tags.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Coins,
    title: "Earn Credits",
    description: "Buyers purchase with credits. Photographers keep 80% of every sale.",
    color: "from-purple-500 to-pink-500",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Authenticity",
    description:
      "Every photo undergoes rigorous verification to ensure it's genuinely human-made with real camera metadata.",
  },
  {
    icon: Eye,
    title: "EXIF Transparency",
    description:
      "Full camera settings, location, and timestamp data preserved and displayed for complete transparency.",
  },
  {
    icon: Lock,
    title: "Secure Licensing",
    description:
      "Clear, straightforward licensing options with legal protection for both photographers and buyers.",
  },
  {
    icon: Award,
    title: "Creator First",
    description:
      "Photographers keep 80% of earnings. Your art, your income, your control.",
  },
];

// Animated stat component
function AnimatedStat({ stat, index }: { stat: StatItem; index: number }) {
  const { count, nodeRef } = useAnimatedCounter(
    stat.decimal ? Math.floor(stat.value * 10) : stat.value,
    2000
  );

  const displayValue = stat.decimal ? (count / 10).toFixed(1) : count.toLocaleString();

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center"
    >
      <div className="text-5xl font-black text-amber-400 md:text-6xl tracking-tight">
        {displayValue}{stat.suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div className="relative min-h-screen bg-background">
      <Header />

      {/* Hero Section with Three.js */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 hero-gradient" />

        {/* Three.js Scene - positioned behind content */}
        <div className="absolute inset-0 z-0">
          <HeroScene className="h-full w-full" />
        </div>

        {/* Radial gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background z-[1]" />

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-400 backdrop-blur-sm"
            >
              <Sparkles size={16} className="animate-pulse" />
              Introducing verified human photography
            </motion.div>

            {/* Main headline - DM Sans styling */}
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-8xl">
              <span className="text-foreground">Real Photos.</span>
              <br />
              <span className="gradient-text">Real Humans.</span>
              <br />
              <span className="text-foreground">Real Trust.</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-muted-foreground sm:text-xl leading-relaxed">
              In an AI-saturated world, authenticity matters. Every photo on Photolectic
              is verified as genuine human-made photography with complete metadata transparency.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register?role=photographer">
                <Button
                  size="lg"
                  className="h-14 gap-2 bg-amber-500 px-8 text-lg font-bold text-black hover:bg-amber-400 glow-amber transition-all duration-300 hover:scale-105"
                >
                  <Camera size={20} />
                  I&apos;m a Photographer
                </Button>
              </Link>
              <Link href="/gallery">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 gap-2 border-white/20 px-8 text-lg font-semibold hover:bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  Browse Gallery
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-xs font-medium uppercase tracking-widest">Scroll to explore</span>
              <div className="h-12 w-px bg-gradient-to-b from-amber-500/50 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Infinite Photo Marquee */}
      <section className="relative overflow-hidden py-8 bg-black/30">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
        <motion.div
          className="flex gap-4"
          animate={{ x: [0, -2400] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...marqueePhotos, ...marqueePhotos].map((src, i) => (
            <div key={i} className="relative h-48 w-72 flex-shrink-0 overflow-hidden rounded-xl">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="288px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="relative border-y border-white/5 bg-black/50 py-20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <AnimatedStat key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-black sm:text-5xl tracking-tight">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-light text-lg">
              From upload to earnings in three simple steps
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative group"
              >
                {/* Connection line */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}

                <div className="text-center">
                  {/* Step number */}
                  <div className="mb-4 text-7xl font-black text-white/5">
                    0{i + 1}
                  </div>

                  {/* Icon */}
                  <div className={`-mt-12 mb-6 inline-flex rounded-2xl bg-gradient-to-br ${step.color} p-5 text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon size={32} strokeWidth={1.5} />
                  </div>

                  <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-black sm:text-5xl tracking-tight">
              Curated <span className="gradient-text">Excellence</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-light text-lg">
              Every photo verified. Every creator celebrated. Explore authentic human photography
              from around the world.
            </p>
          </motion.div>

          {/* Masonry Gallery */}
          <div className="masonry-grid">
            {featuredPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="masonry-item"
              >
                <Link href={`/gallery/${i + 1}`} className="group block">
                  <div className="photo-card">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                      <Image
                        src={photo.src}
                        alt={photo.category}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      {/* Verified badge */}
                      <div className="absolute left-3 top-3">
                        <VerifiedBadge size="sm" showLabel={false} />
                      </div>

                      {/* Info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="text-sm font-semibold text-amber-400 uppercase tracking-wider">{photo.category}</p>
                        <p className="text-xl font-bold text-white mt-1">
                          {photo.photographer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link href="/gallery">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-white/20 hover:bg-white/5 font-semibold px-8 h-14 text-lg transition-all duration-300 hover:scale-105"
              >
                View Full Gallery
                <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-white/5 bg-black/30 py-32 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-black sm:text-5xl tracking-tight">
              Why <span className="gradient-text">Photolectic</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-light text-lg">
              We&apos;re building the most trusted marketplace for authentic human photography.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="stat-card group hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-amber-500/10 p-4 text-amber-400 transition-colors group-hover:bg-amber-500/20">
                  <feature.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-40">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-emerald-500/10" />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Logo size="xl" variant="icon" className="mx-auto mb-10 animate-pulse" />
            <h2 className="text-5xl font-black sm:text-6xl tracking-tight">
              Ready to join the
              <br />
              <span className="gradient-text">authenticity movement</span>?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-xl text-muted-foreground font-light leading-relaxed">
              Whether you&apos;re a photographer looking to showcase your work or a buyer
              seeking genuine imagery, Photolectic is your home.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register?role=photographer">
                <Button
                  size="lg"
                  className="h-16 gap-2 bg-amber-500 px-10 text-xl font-bold text-black hover:bg-amber-400 transition-all duration-300 hover:scale-105"
                >
                  <Camera size={24} />
                  Start as Photographer
                </Button>
              </Link>
              <Link href="/register?role=buyer">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 gap-2 border-white/20 px-10 text-xl font-semibold hover:bg-white/5 transition-all duration-300 hover:scale-105"
                >
                  <Users size={24} />
                  Start as Buyer
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Telegram Section */}
      <section className="border-t border-white/5 bg-black/50 py-20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold tracking-tight">
                Upload from <span className="text-amber-400">Telegram</span>
              </h3>
              <p className="mt-2 text-muted-foreground font-light text-lg">
                Connect your account and upload photos instantly via our Telegram bot.
              </p>
            </div>
            <Link href="/integrations/telegram">
              <Button variant="outline" className="gap-2 border-white/20 hover:bg-white/5 font-semibold px-6 h-12 transition-all duration-300 hover:scale-105">
                <Zap size={18} />
                Connect Telegram
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
