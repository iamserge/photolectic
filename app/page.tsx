"use client";

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Header, Footer } from "@/components/layout";
import { VerifiedBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Camera, ArrowRight } from "lucide-react";

// Smooth spring config
const smoothSpring = { stiffness: 100, damping: 30, mass: 1 };

// Animated counter with easing
function useAnimatedCounter(end: number, duration: number = 2000, decimal?: boolean) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const target = decimal ? end * 10 : end;
    let startTime: number;
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutExpo(progress);
      setCount(Math.floor(easedProgress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration, decimal]);

  return { count: decimal ? count / 10 : count, nodeRef };
}

// Photo data
const photos = [
  { src: "/images/seed/seed-landscape-01.webp", category: "Landscape" },
  { src: "/images/seed/seed-portrait-04.webp", category: "Portrait" },
  { src: "/images/seed/seed-street-07.webp", category: "Street" },
  { src: "/images/seed/seed-architecture-09.webp", category: "Architecture" },
  { src: "/images/seed/seed-wildlife-11.webp", category: "Wildlife" },
  { src: "/images/seed/seed-travel-17.webp", category: "Travel" },
  { src: "/images/seed/seed-urban-19.webp", category: "Urban" },
  { src: "/images/seed/seed-food-13.webp", category: "Food" },
];

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
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), smoothSpring);
  const heroOpacity = useSpring(useTransform(scrollYProgress, [0, 0.6], [1, 0]), smoothSpring);
  const heroScale = useSpring(useTransform(scrollYProgress, [0, 0.6], [1, 0.9]), smoothSpring);

  const stat1 = useAnimatedCounter(50000, 2500);
  const stat2 = useAnimatedCounter(2500, 2500);
  const stat3 = useAnimatedCounter(99.9, 2500, true);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Sexy animated background */}
        <div className="absolute inset-0 z-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-background" />

          {/* Aurora effect - flowing gradients */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(245,158,11,0.15) 0%, transparent 60%)",
                "radial-gradient(ellipse 80% 60% at 80% 60%, rgba(245,158,11,0.15) 0%, transparent 60%)",
                "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(245,158,11,0.15) 0%, transparent 60%)",
                "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(245,158,11,0.15) 0%, transparent 60%)",
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Secondary aurora layer */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(ellipse 60% 80% at 70% 20%, rgba(217,119,6,0.1) 0%, transparent 50%)",
                "radial-gradient(ellipse 60% 80% at 30% 70%, rgba(217,119,6,0.1) 0%, transparent 50%)",
                "radial-gradient(ellipse 60% 80% at 60% 50%, rgba(217,119,6,0.1) 0%, transparent 50%)",
                "radial-gradient(ellipse 60% 80% at 70% 20%, rgba(217,119,6,0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          {/* Mesh gradient blobs */}
          <motion.div
            className="absolute w-[800px] h-[800px] -top-[200px] -left-[200px] rounded-full bg-amber-500/10 blur-[150px]"
            animate={{
              x: [0, 100, 50, 0],
              y: [0, 50, 100, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[600px] h-[600px] top-[20%] right-[-100px] rounded-full bg-orange-500/8 blur-[120px]"
            animate={{
              x: [0, -80, -40, 0],
              y: [0, 80, 40, 0],
              scale: [1, 0.8, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] bottom-[10%] left-[30%] rounded-full bg-yellow-500/5 blur-[100px]"
            animate={{
              x: [0, 60, -30, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.3, 1, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />

          {/* Subtle grain overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center pt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-6xl"
          >
            {/* Massive Headline */}
            <h1 className="mb-8 font-display font-bold tracking-tighter uppercase overflow-hidden">
              {["Real Photos.", "Real Humans.", "Real Trust."].map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2 + i * 0.12,
                    duration: 1,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className={`block text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] leading-[0.85] ${i === 1 ? "gradient-text" : "text-foreground"}`}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground sm:text-2xl leading-relaxed font-body font-light"
            >
              In an AI-saturated world, authenticity matters.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/register?role=photographer">
                <Button
                  size="lg"
                  className="h-16 gap-3 bg-amber-500 px-10 text-xl font-bold text-black hover:bg-amber-400 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(245,158,11,0.4)]"
                >
                  <Camera size={24} />
                  Start Uploading
                </Button>
              </Link>
              <Link href="/gallery">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 gap-3 border-white/20 px-10 text-xl font-semibold hover:bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-105"
                >
                  Browse Gallery
                  <ArrowRight size={24} />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="h-16 w-px bg-gradient-to-b from-amber-500/60 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Photo Marquee */}
      <section className="relative overflow-hidden py-6 bg-black/40 border-y border-white/5">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          className="flex gap-4"
          animate={{ x: [0, -2000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...marqueePhotos, ...marqueePhotos].map((src, i) => (
            <motion.div
              key={i}
              className="relative h-44 w-64 flex-shrink-0 overflow-hidden rounded-xl"
              whileHover={{ scale: 1.05, zIndex: 10 }}
              transition={{ duration: 0.4 }}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="256px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-3 gap-8">
            {[
              { ref: stat1.nodeRef, value: stat1.count.toLocaleString(), suffix: "+", label: "Verified Photos" },
              { ref: stat2.nodeRef, value: stat2.count.toLocaleString(), suffix: "+", label: "Photographers" },
              { ref: stat3.nodeRef, value: (stat3.count as number).toFixed(1), suffix: "%", label: "Authenticity" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                ref={stat.ref}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl font-display font-bold text-amber-400 sm:text-5xl md:text-6xl tracking-tight">
                  {stat.value}{stat.suffix}
                </div>
                <div className="mt-2 text-xs sm:text-sm text-muted-foreground uppercase tracking-widest font-body">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-display font-bold sm:text-5xl tracking-tight uppercase">
              Curated <span className="gradient-text">Excellence</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground font-body">
              Every photo verified. Every creator celebrated.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Link href={`/gallery/${i + 1}`} className="group block">
                  <motion.div
                    className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.category}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute left-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <VerifiedBadge size="sm" showLabel={false} />
                    </div>

                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-sm font-semibold text-amber-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-display">
                        {photo.category}
                      </p>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link href="/gallery">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-white/20 hover:bg-white/5 font-semibold px-8 h-14 text-lg transition-all duration-500 hover:scale-105"
              >
                View All Photos
                <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-display font-bold sm:text-6xl tracking-tight mb-6 uppercase">
              Ready to join?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 font-body">
              Start sharing your authentic photography with the world.
            </p>

            <Link href="/register">
              <Button
                size="lg"
                className="h-16 gap-2 bg-amber-500 px-12 text-xl font-bold text-black hover:bg-amber-400 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(245,158,11,0.5)]"
              >
                <Camera size={24} />
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
