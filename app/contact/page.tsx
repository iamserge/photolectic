"use client";

import { useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Clock, Send, MessageSquare, Building2, HelpCircle } from "lucide-react";
import { toast } from "sonner";

const contactReasons = [
  { id: "general", label: "General Inquiry", icon: MessageSquare },
  { id: "support", label: "Technical Support", icon: HelpCircle },
  { id: "enterprise", label: "Enterprise Sales", icon: Building2 },
  { id: "press", label: "Press & Media", icon: Mail },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState("general");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent! We'll get back to you within 24 hours.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-light">
              Have questions? We&apos;d love to hear from you. Our team typically responds
              within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <div className="stat-card">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

              {/* Reason Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {contactReasons.map((reason) => (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setSelectedReason(reason.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                      selectedReason === reason.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-400"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <reason.icon size={18} />
                    <span className="text-sm font-medium">{reason.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us more..."
                    required
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold gap-2"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="stat-card">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email Us</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      For general inquiries and support
                    </p>
                    <a
                      href="mailto:support@photolectic.com"
                      className="text-amber-400 hover:underline"
                    >
                      support@photolectic.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Location</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      We&apos;re a globally distributed team
                    </p>
                    <p className="text-sm">
                      San Francisco, CA<br />
                      London, UK<br />
                      Singapore
                    </p>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Response Time</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      We aim to respond quickly
                    </p>
                    <p className="text-sm">
                      General: Within 24 hours<br />
                      Support: Within 4 hours<br />
                      Enterprise: Dedicated rep
                    </p>
                  </div>
                </div>
              </div>

              <div className="stat-card bg-amber-500/5 border-amber-500/20">
                <h3 className="font-bold mb-2">Enterprise Solutions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Looking for custom licensing, API access, or white-label solutions?
                  Our enterprise team can help.
                </p>
                <Link href="/contact?type=enterprise">
                  <Button variant="outline" className="border-amber-500/50 hover:bg-amber-500/10">
                    Talk to Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
