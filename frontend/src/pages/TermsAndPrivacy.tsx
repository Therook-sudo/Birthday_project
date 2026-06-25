import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsAndPrivacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-12 md:py-20">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              MerkTag Terms of Use and Privacy Policy
            </h1>
            <p className="mt-3 text-muted-foreground">
              Last updated: {new Date().getFullYear()}
            </p>
          </div>

          <section className="gradient-card space-y-6 rounded-2xl border border-border p-6 shadow-soft md:p-8">
            <p>
              Welcome to MerkTag. MerkTag helps users remember birthdays, create
              wishlists, save gift ideas, and receive reminders for important
              dates.
            </p>

            <p>
              By creating an account or using MerkTag, you agree to these Terms
              of Use and Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By signing up for MerkTag, you confirm that you have read and
              understood these Terms and Privacy Policy, agree to use MerkTag
              responsibly and lawfully, and confirm that the information you
              provide is accurate.
            </p>
            <p>
              Where you add another person’s birthday, name, contact details, or
              wishlist information, you confirm that you have their permission or
              a lawful reason to do so.
            </p>

            <h2 className="text-2xl font-semibold">2. What MerkTag Does</h2>
            <p>
              MerkTag may allow users to create an account, save birthdays and
              important dates, add gift ideas and wishlist links, receive
              reminders, share wishlist links, and manage personal celebration
              information.
            </p>

            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p>
              You are responsible for keeping your login details safe, not
              sharing your account, ensuring your account information is correct,
              and informing us if you suspect unauthorized access.
            </p>

            <h2 className="text-2xl font-semibold">4. Age Requirement</h2>
            <p>
              MerkTag is intended for users who are old enough to legally consent
              to the use of their personal information in their country. If you
              are under the required age, you must have permission from a parent
              or legal guardian.
            </p>

            <h2 className="text-2xl font-semibold">5. User Content</h2>
            <p>
              You remain responsible for names, birthdays, contact details,
              wishlist items, notes, links, descriptions, and other content you
              add. You agree not to upload unlawful, harmful, misleading,
              abusive, privacy-invasive, infringing, spam-related, or fraudulent
              content.
            </p>

            <h2 className="text-2xl font-semibold">6. Third-Party Links</h2>
            <p>
              MerkTag may allow links to third-party websites. We do not control
              those websites, their prices, delivery, availability, refund
              policies, or product quality. Any purchase through an external link
              is between you and the third-party seller.
            </p>

            <h2 className="text-2xl font-semibold">
              7. Reminders and Notifications
            </h2>
            <p>
              MerkTag may send reminders by email, app notification, WhatsApp,
              SMS, or other supported channels. We do not guarantee that every
              reminder will always be delivered at the exact intended time.
            </p>

            <h2 className="text-2xl font-semibold">8. Payments</h2>
            <p>
              If MerkTag later supports payments, gift contributions, wallet
              features, or money collection, additional payment terms may apply.
              MerkTag does not currently act as a bank, financial adviser, or
              escrow provider unless clearly stated in separate payment terms.
            </p>

            <h2 className="text-2xl font-semibold">9. Acceptable Use</h2>
            <p>
              You agree not to use MerkTag to break laws, harass or impersonate
              others, collect personal information without permission, send spam,
              upload malicious code, disrupt the platform, or use MerkTag for
              fraud or scams.
            </p>

            <h2 className="text-2xl font-semibold">
              10. Ownership and Intellectual Property
            </h2>
            <p>
              MerkTag, including its name, logo, design, software, features,
              content, and branding, belongs to Tecvator or its licensors. You
              retain ownership of your personal content, but allow MerkTag to use
              it only as needed to provide the service.
            </p>

            <h2 className="text-2xl font-semibold">11. Information We Collect</h2>
            <p>
              MerkTag may collect account information, birthday and reminder
              information, wishlist information, technical information, and
              communication information such as support messages and feedback.
            </p>

            <h2 className="text-2xl font-semibold">
              12. How We Use Your Information
            </h2>
            <p>
              We use your information to create and manage your account, save
              birthdays and wishlists, send reminders, allow sharing features,
              improve MerkTag, provide support, prevent abuse, send service
              updates, and comply with legal obligations. We do not sell your
              personal information.
            </p>

            <h2 className="text-2xl font-semibold">
              13. Legal Basis for Processing
            </h2>
            <p>
              Depending on your location, we process personal information based
              on consent, the need to provide MerkTag’s services, legitimate
              interests, legal obligations, and protection of users and the
              platform.
            </p>

            <h2 className="text-2xl font-semibold">
              14. Information About Other People
            </h2>
            <p>
              If you add another person’s birthday, name, gift idea, or contact
              detail, you are responsible for ensuring you have permission or a
              lawful reason to do so.
            </p>

            <h2 className="text-2xl font-semibold">
              15. Sharing of Information
            </h2>
            <p>
              We may share limited information with trusted service providers who
              help us operate MerkTag, such as hosting, email delivery,
              notification, analytics, support, security, and payment providers
              where applicable.
            </p>

            <h2 className="text-2xl font-semibold">
              16. Public or Shared Wishlist Links
            </h2>
            <p>
              If you share a wishlist link, people with access to that link may
              view the information included. You are responsible for deciding who
              you share it with.
            </p>

            <h2 className="text-2xl font-semibold">
              17. Data Storage and Security
            </h2>
            <p>
              We take reasonable steps to protect your personal information from
              unauthorized access, loss, misuse, alteration, or disclosure. You
              are responsible for using a strong password and keeping your
              account details confidential.
            </p>

            <h2 className="text-2xl font-semibold">18. Data Retention</h2>
            <p>
              We keep personal information for as long as needed to provide
              MerkTag, maintain accounts, comply with legal obligations, resolve
              disputes, and prevent fraud or abuse.
            </p>

            <h2 className="text-2xl font-semibold">19. Your Privacy Rights</h2>
            <p>
              Depending on your country, you may have rights to access, correct,
              delete, restrict, object to processing, withdraw consent, request a
              copy of your data, or complain to a data protection authority.
            </p>

            <h2 className="text-2xl font-semibold">
              20. Cookies and Analytics
            </h2>
            <p>
              MerkTag may use cookies or similar technologies to keep users
              signed in, remember preferences, understand platform usage, improve
              performance, and support security.
            </p>

            <h2 className="text-2xl font-semibold">
              21. Marketing Communications
            </h2>
            <p>
              We may send updates, product announcements, or promotional
              messages where permitted by law. You may unsubscribe from marketing
              messages at any time.
            </p>

            <h2 className="text-2xl font-semibold">
              22. International Data Transfers
            </h2>
            <p>
              MerkTag may use providers or hosting systems in different
              countries. Where information is transferred internationally, we
              will take reasonable steps to protect it according to applicable
              data protection laws.
            </p>

            <h2 className="text-2xl font-semibold">23. Account Deletion</h2>
            <p>
              You may request account deletion by contacting us. We may remove or
              anonymize your information unless certain data must be retained for
              legal, security, fraud-prevention, or operational reasons.
            </p>

            <h2 className="text-2xl font-semibold">
              24. Service Availability
            </h2>
            <p>
              MerkTag is provided on an “as is” and “as available” basis.
            </p>

            <h2 className="text-2xl font-semibold">
              25. Limitation of Liability
            </h2>
            <p>
              To the fullest extent allowed by law, MerkTag and Tecvator will not
              be liable for indirect, incidental, special, or consequential
              losses arising from your use of the platform.
            </p>

            <h2 className="text-2xl font-semibold">
              26. Changes to These Terms
            </h2>
            <p>
              We may update these Terms and Privacy Policy from time to time. If
              important changes are made, we may notify you by email, in-app
              notice, or another reasonable method.
            </p>

            <h2 className="text-2xl font-semibold">27. Contact Us</h2>
            <p>
              For questions about these Terms or Privacy Policy, contact MerkTag
              Support at{" "}
              <a
                href="mailto:hi@merktag.com"
                className="text-primary hover:underline"
              >
                hi@merktag.com
              </a>
              .
            </p>

            <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">
                Signup Consent Statement:
              </strong>{" "}
              By ticking the checkbox during signup, you confirm that you have
              read and agree to MerkTag’s Terms of Use and Privacy Policy, and
              that MerkTag may process your personal information to create your
              account, save birthdays and wishlists, and send reminders.
            </div>
          </section>

          <div className="text-center">
            <Link to="/" className="text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}