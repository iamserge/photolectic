import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Heart, Zap, Globe, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Photolectic team and help build the future of authentic photography verification.",
};

const openPositions = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    salary: "$150k - $200k",
    description: "Build and scale our photo verification platform using Next.js, TypeScript, and AI/ML technologies.",
  },
  {
    title: "ML Engineer - Image Analysis",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$160k - $220k",
    description: "Develop and improve our AI detection algorithms to identify authentic vs. generated imagery.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "San Francisco / Remote",
    type: "Full-time",
    salary: "$130k - $170k",
    description: "Design beautiful, intuitive experiences for photographers and buyers on our platform.",
  },
  {
    title: "Head of Photographer Relations",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $140k",
    description: "Build and nurture our community of verified photographers worldwide.",
  },
  {
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $120k",
    description: "Create compelling content that educates the market about authentic photography.",
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance for you and your family.",
  },
  {
    icon: Globe,
    title: "Remote First",
    description: "Work from anywhere in the world. We're a globally distributed team.",
  },
  {
    icon: Zap,
    title: "Equity",
    description: "Meaningful equity ownership in the company's success.",
  },
  {
    icon: Users,
    title: "Team Retreats",
    description: "Annual all-hands retreats in beautiful locations around the world.",
  },
];

const values = [
  "We believe authentic human creativity has irreplaceable value",
  "We're building technology that empowers, not replaces, creators",
  "We prioritize transparency in everything we do",
  "We move fast but never compromise on quality",
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              Build the Future of <span className="gradient-text">Authentic</span> Photography
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-light">
              Join a passionate team working to preserve and celebrate human creativity
              in an AI-saturated world.
            </p>
            <div className="mt-8">
              <Link href="#positions">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold gap-2">
                  View Open Positions
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Photolectic?</h2>
              <p className="text-muted-foreground mb-6">
                We&apos;re on a mission to build the most trusted marketplace for authentic
                human photography. As AI-generated imagery becomes ubiquitous, our work
                becomes more important than ever.
              </p>
              <ul className="space-y-4">
                {values.map((value, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="stat-card">
                  <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 w-fit mb-3">
                    <benefit.icon size={20} />
                  </div>
                  <h3 className="font-bold mb-1">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="border-t border-white/5 bg-black/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground">
              We&apos;re always looking for talented people to join our team.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {openPositions.map((position) => (
              <div
                key={position.title}
                className="stat-card hover:scale-[1.01] transition-transform cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <span className="text-amber-400 text-sm font-medium">
                      {position.department}
                    </span>
                    <h3 className="text-xl font-bold mt-1">{position.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {position.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {position.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {position.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={14} />
                        {position.salary}
                      </span>
                    </div>
                  </div>
                  <Link href={`/careers/${position.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button variant="outline" className="border-white/20 hover:bg-white/5 whitespace-nowrap">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't See a Fit */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Don&apos;t see a perfect fit?</h2>
          <p className="text-muted-foreground mb-8">
            We&apos;re always interested in meeting talented people. Send us your resume
            and tell us why you&apos;d be great at Photolectic.
          </p>
          <Link href="mailto:careers@photolectic.com">
            <Button variant="outline" className="border-white/20 hover:bg-white/5">
              Send General Application
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
