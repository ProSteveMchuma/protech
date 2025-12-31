export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="mb-4 text-muted-foreground">Last Updated: October 24, 2024</p>

            <div className="prose prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
                    <p className="text-muted-foreground">
                        We collect information you provide directly to us when you fill out a contact form, request a quote, or communicate with us. This includes:
                    </p>
                    <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                        <li>Name and contact details (email, phone number).</li>
                        <li>Company information and project requirements.</li>
                        <li>Billing information for processed orders.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
                    <p className="text-muted-foreground">
                        We use the information we collect to provide, maintain, and improve our services, including to:
                    </p>
                    <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                        <li>Process transactions and send related information, including confirmations and invoices.</li>
                        <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
                        <li>Respond to your comments, questions, and requests.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Data Security</h2>
                    <p className="text-muted-foreground">
                        We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no data transmission over the Internet is 100% secure.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Contact Us</h2>
                    <p className="text-muted-foreground">
                        If you have any questions about this Privacy Policy, please contact us at: <br />
                        <span className="font-semibold text-foreground">hello@proinnovation.tech</span>
                    </p>
                </section>
            </div>
        </div>
    );
}
