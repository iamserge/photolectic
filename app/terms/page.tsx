import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Photolectic's photography marketplace and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 1, 2024</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing or using Photolectic&apos;s website and services, you agree to be bound
                by these Terms of Service. If you do not agree to these terms, you may not use
                our services.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Continued use of the
                service after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Photolectic is a marketplace for verified, authentic human-made photography.
                We provide a platform connecting photographers who upload and sell their work
                with buyers seeking genuine imagery. Our services include photo verification,
                licensing, and transaction processing.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
              <p className="text-muted-foreground mb-4">
                To use certain features, you must create an account. You agree to provide
                accurate information and keep it updated. You are responsible for maintaining
                the confidentiality of your account credentials.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.2 Account Types</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Photographers:</strong> May upload, manage, and sell photos</li>
                <li><strong>Buyers:</strong> May browse, purchase, and download photos</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Photographer Terms</h2>

              <h3 className="text-xl font-semibold mb-3">4.1 Content Requirements</h3>
              <p className="text-muted-foreground mb-4">
                By uploading photos, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>You are the original creator of the photograph</li>
                <li>The photo was captured using a physical camera (not AI-generated)</li>
                <li>You have all necessary rights and permissions to sell the photo</li>
                <li>The photo does not infringe any third-party rights</li>
                <li>Required model/property releases are obtained where applicable</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">4.2 Verification Process</h3>
              <p className="text-muted-foreground mb-4">
                All uploaded photos undergo our verification process to confirm authenticity.
                We may reject photos that fail verification or request additional information.
              </p>

              <h3 className="text-xl font-semibold mb-3">4.3 Revenue Share</h3>
              <p className="text-muted-foreground">
                Photographers receive 80% of net sales revenue. Payments are processed monthly
                for balances exceeding $50. We reserve the right to withhold payments pending
                fraud investigation.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Buyer Terms</h2>

              <h3 className="text-xl font-semibold mb-3">5.1 License Grant</h3>
              <p className="text-muted-foreground mb-4">
                Upon purchase, buyers receive a license to use the photo according to the
                selected license type. See our License Agreement for full details.
              </p>

              <h3 className="text-xl font-semibold mb-3">5.2 Prohibited Uses</h3>
              <p className="text-muted-foreground mb-4">
                Purchased photos may not be:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Resold or redistributed as standalone files</li>
                <li>Used in a manner that suggests endorsement</li>
                <li>Used for illegal or defamatory purposes</li>
                <li>Used to train AI models without explicit permission</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Prohibited Content</h2>
              <p className="text-muted-foreground mb-4">
                The following content is strictly prohibited:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>AI-generated or manipulated images presented as authentic photography</li>
                <li>Content depicting illegal activities</li>
                <li>Pornographic or explicit sexual content</li>
                <li>Content promoting violence, hate, or discrimination</li>
                <li>Content infringing intellectual property rights</li>
                <li>Photos of identifiable individuals without consent</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Payments and Refunds</h2>
              <p className="text-muted-foreground mb-4">
                All payments are processed securely through our payment provider. Prices are
                in USD unless otherwise specified.
              </p>
              <p className="text-muted-foreground">
                Individual photo purchases are generally non-refundable. Subscription refunds
                are available within 30 days of purchase. We will work with customers to
                resolve any issues with purchased content.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
              <p className="text-muted-foreground">
                Photographers retain copyright to their photos. By uploading, you grant
                Photolectic a non-exclusive license to display, promote, and sell your content
                on our platform. The Photolectic brand, logo, and platform are our intellectual
                property.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Photolectic is provided &quot;as is&quot; without warranties of any kind. We are not
                liable for any indirect, incidental, or consequential damages arising from
                your use of our services. Our total liability is limited to the amount paid
                by you in the preceding 12 months.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account at any time for violations of these
                terms. Upon termination, your right to use the service ceases immediately.
                Photographers may withdraw their content at any time, but existing licenses
                remain valid.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">11. Dispute Resolution</h2>
              <p className="text-muted-foreground">
                Any disputes shall be resolved through binding arbitration in San Francisco,
                California, under the rules of the American Arbitration Association. You
                agree to waive any right to a jury trial or class action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, contact us at:<br />
                Email: legal@photolectic.com<br />
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
