import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for authentic photography. Pay per photo or subscribe for unlimited access.",
};

const plans = [
  {
    name: "Pay Per Photo",
    description: "Perfect for occasional buyers",
    price: "From $5",
    period: "per photo",
    icon: Zap,
    features: [
      "Download individual photos",
      "Standard license included",
      "High-resolution files",
      "EXIF data included",
      "Commercial use rights",
      "No subscription required",
    ],
    cta: "Browse Gallery",
    href: "/gallery",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For professionals and agencies",
    price: "$49",
    period: "per month",
    icon: Crown,
    features: [
      "50 downloads per month",
      "Extended license included",
      "Priority support",
      "Early access to new photos",
      "Exclusive collections",
      "API access",
      "Team sharing (up to 5)",
    ],
    cta: "Start Pro Trial",
    href: "/register?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: "Custom",
    period: "contact us",
    icon: Building2,
    features: [
      "Unlimited downloads",
      "Custom licensing terms",
      "Dedicated account manager",
      "SLA guarantees",
      "Custom integrations",
      "Bulk upload support",
      "White-label options",
    ],
    cta: "Contact Sales",
    href: "/contact?type=enterprise",
    highlighted: false,
  },
];

const photographerBenefits = [
  { title: "80% Revenue Share", description: "Keep the majority of your earnings" },
  { title: "No Upfront Costs", description: "Free to join and upload" },
  { title: "Global Exposure", description: "Reach buyers worldwide" },
  { title: "Verified Status", description: "Build trust with authenticity badge" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-display font-bold uppercase tracking-tight sm:text-6xl">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-body font-light">
              Pay for what you need. No hidden fees, no surprises.
              Just authentic photography at fair prices.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`stat-card relative ${
                  plan.highlighted
                    ? "border-amber-500/50 bg-amber-500/5"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="inline-flex rounded-xl bg-amber-500/10 p-3 text-amber-400 mb-4">
                    <plan.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-display font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="block">
                  <Button
                    className={`w-full font-bold ${
                      plan.highlighted
                        ? "bg-amber-500 hover:bg-amber-400 text-black"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Photographers */}
      <section className="border-t border-white/5 bg-black/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold uppercase mb-4">
              For <span className="text-amber-400">Photographers</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join free and start earning from your authentic photography today.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {photographerBenefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <h3 className="text-xl font-bold text-amber-400 mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/register?role=photographer">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
                Start Selling Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold uppercase text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "What license do I get with each purchase?",
                a: "Standard purchases include a commercial license for up to 500,000 impressions. Extended licenses are available for larger projects or unlimited use.",
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period.",
              },
              {
                q: "How do refunds work?",
                a: "We offer a 30-day money-back guarantee for subscriptions. Individual photo purchases are non-refundable but we'll work with you on any issues.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and wire transfers for enterprise customers.",
              },
            ].map((faq) => (
              <div key={faq.q} className="stat-card">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
