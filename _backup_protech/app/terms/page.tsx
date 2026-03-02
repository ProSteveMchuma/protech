export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <p className="mb-4 text-muted-foreground">Last Updated: October 24, 2024</p>

            <div className="prose prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground">
                        By accessing or using the services provided by Pro Innovation & Technologies ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree, you may not access our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Services</h2>
                    <p className="text-muted-foreground">
                        We provide digital and physical services including Web Design, Tender Writing, Automation, and Branding. Specific deliverables, timelines, and costs will be outlined in a separate agreement or quote provided to you.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Payment Terms</h2>
                    <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                        <li>A deposit is typically required to commence work, as specified in your quote.</li>
                        <li>Final payment is due upon completion or delivery of the project.</li>
                        <li>We reserve the right to withhold final deliverables until full payment is received.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Intellectual Property</h2>
                    <p className="text-muted-foreground">
                        Upon full payment, you will own the rights to the final deliverables created for you. Pro Innovation & Technologies retains the right to display the work in our portfolio and social media for promotional purposes.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Limitation of Liability</h2>
                    <p className="text-muted-foreground">
                        To the maximum extent permitted by law, Pro Innovation & Technologies shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
                    </p>
                </section>
            </div>
        </div>
    );
}
