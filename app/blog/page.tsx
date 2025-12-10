import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on authentic photography, AI detection, and the future of visual content from the Photolectic team.",
};

const blogPosts = [
  {
    slug: "why-authenticity-matters",
    title: "Why Authenticity Matters More Than Ever in Photography",
    excerpt: "In an age of AI-generated imagery, authentic human photography has become a rare and valuable commodity. Here's why it matters.",
    image: "/images/seed/seed-landscape-01.webp",
    author: "Sarah Chen",
    date: "December 5, 2024",
    readTime: "5 min read",
    category: "Industry Insights",
  },
  {
    slug: "exif-data-explained",
    title: "Understanding EXIF Data: Your Photo's Digital Fingerprint",
    excerpt: "Learn how EXIF metadata proves authenticity and why it's the foundation of trust in human photography.",
    image: "/images/seed/seed-architecture-09.webp",
    author: "Marcus Webb",
    date: "November 28, 2024",
    readTime: "7 min read",
    category: "Education",
  },
  {
    slug: "photographer-revenue-guide",
    title: "Maximizing Your Earnings as a Verified Photographer",
    excerpt: "Tips and strategies for photographers looking to build a sustainable income through authentic photography licensing.",
    image: "/images/seed/seed-portrait-04.webp",
    author: "Emma Rodriguez",
    date: "November 20, 2024",
    readTime: "6 min read",
    category: "Creator Tips",
  },
  {
    slug: "ai-detection-technology",
    title: "How We Detect AI-Generated Images",
    excerpt: "A deep dive into our verification process and the technology behind detecting synthetic imagery.",
    image: "/images/seed/seed-urban-19.webp",
    author: "David Park",
    date: "November 15, 2024",
    readTime: "8 min read",
    category: "Technology",
  },
  {
    slug: "building-trust-marketplace",
    title: "Building Trust in a Visual Marketplace",
    excerpt: "How Photolectic is creating a new standard for authenticity and transparency in stock photography.",
    image: "/images/seed/seed-street-07.webp",
    author: "Lisa Thompson",
    date: "November 8, 2024",
    readTime: "4 min read",
    category: "Company",
  },
  {
    slug: "future-of-photography",
    title: "The Future of Photography in an AI World",
    excerpt: "Exploring how human photography will evolve and maintain its value alongside AI-generated content.",
    image: "/images/seed/seed-travel-17.webp",
    author: "James Liu",
    date: "October 30, 2024",
    readTime: "10 min read",
    category: "Industry Insights",
  },
];

const categories = ["All", "Industry Insights", "Education", "Creator Tips", "Technology", "Company"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              The <span className="gradient-text">Photolectic</span> Blog
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-light">
              Insights on authentic photography, verification technology, and
              building a sustainable creative career.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
                    ? "bg-amber-500 text-black"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href={`/blog/${blogPosts[0].slug}`} className="group block">
            <div className="grid gap-8 lg:grid-cols-2 items-center stat-card hover:scale-[1.01] transition-transform">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <span className="text-amber-400 text-sm font-medium">
                  {blogPosts[0].category}
                </span>
                <h2 className="text-3xl font-bold mt-2 mb-4 group-hover:text-amber-400 transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {blogPosts[0].author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {blogPosts[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {blogPosts[0].readTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="stat-card h-full hover:scale-[1.02] transition-transform">
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-amber-400 text-xs font-medium">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold mt-1 mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-white/5 bg-black/30 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Get the latest insights on authentic photography delivered to your inbox.
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
