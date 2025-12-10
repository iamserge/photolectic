import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Photolectic collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 1, 2024</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Photolectic (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our website and services.
              </p>
              <p className="text-muted-foreground">
                By using Photolectic, you agree to the collection and use of information in
                accordance with this policy.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
              <p className="text-muted-foreground mb-4">
                We may collect personally identifiable information, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Name and email address</li>
                <li>Billing address and payment information</li>
                <li>Profile information (for photographers)</li>
                <li>Location data (with consent)</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Photo Metadata</h3>
              <p className="text-muted-foreground mb-4">
                For photographers, we collect and process EXIF data from uploaded photos, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Camera make and model</li>
                <li>Capture settings (aperture, shutter speed, ISO)</li>
                <li>Date and time of capture</li>
                <li>GPS coordinates (if available and with consent)</li>
              </ul>
              <p className="text-muted-foreground">
                This metadata is essential for our verification process and transparency features.
              </p>

              <h3 className="text-xl font-semibold mb-3">2.3 Usage Data</h3>
              <p className="text-muted-foreground">
                We automatically collect certain information about your device and usage, including
                browser type, IP address, pages visited, and time spent on our platform.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use collected information to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process transactions and send related information</li>
                <li>Verify photo authenticity and prevent fraud</li>
                <li>Communicate with you about updates and promotions</li>
                <li>Analyze usage to improve our platform</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Information Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal information. We may share data with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Service providers:</strong> Payment processors, cloud hosting, analytics</li>
                <li><strong>Buyers:</strong> Photo metadata is displayed for transparency purposes</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect rights</li>
                <li><strong>Business transfers:</strong> In connection with merger or acquisition</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures including encryption, secure
                servers, and regular security audits. However, no method of transmission over
                the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, contact us at privacy@photolectic.com.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to improve your experience.
                You can control cookie settings through your browser preferences. Essential
                cookies are required for the platform to function properly.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. International Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries other than
                your own. We ensure appropriate safeguards are in place to protect your data
                in accordance with applicable laws.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not intended for children under 16. We do not knowingly
                collect personal information from children. If you believe we have collected
                data from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of
                any changes by posting the new policy on this page and updating the
                &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                For questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-muted-foreground">
                Email: privacy@photolectic.com<br />
                Address: Photolectic Inc., San Francisco, CA
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
