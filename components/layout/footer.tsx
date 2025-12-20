"use client";

import Link from "next/link";
import { Logo } from "@/components/brand";
import { Github, Twitter, Instagram } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Gallery", href: "/gallery" },
    { label: "Photographers", href: "/photographers" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "/docs/api" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "License Agreement", href: "/license-agreement" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/photolectic", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/photolectic", label: "Instagram" },
  { icon: Github, href: "https://github.com/photolectic", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
            {/* Brand column */}
            <div className="col-span-2 lg:col-span-2">
              <Logo size="lg" />
              <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
                Verified human photography in an AI-saturated world.
                Every image authenticated, every creator celebrated.
              </p>
              {/* Social links */}
              <div className="mt-6 flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-amber-400 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links columns */}
            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-wide text-foreground">Product</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-wide text-foreground">Company</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-wide text-foreground">Legal</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Photolectic. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Made with light and authenticity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
