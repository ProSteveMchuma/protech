import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { business } from "@/lib/config";

export const metadata = {
    title: "Privacy Policy",
    description: "How Pro Remote Tasks handles and protects your personal information.",
};

export default function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 text-sm"
                >
                    <ArrowLeft className="size-4 mr-2" /> Back to home
                </Link>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-3 text-balance">
                    Privacy policy
                </h1>
                <p className="text-slate-500 mb-12 text-sm">
                    Last updated:{" "}
                    {new Date().toLocaleDateString("en-KE", {
                        timeZone: "Africa/Nairobi",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>

                <div className="prose prose-slate max-w-none">
                    <h3>1. Introduction</h3>
                    <p>
                        Welcome to {business.name} ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy.
                    </p>

                    <h3>2. Information we collect</h3>
                    <p>
                        We collect personal information that you voluntarily provide when you apply for talent or request services. This includes names, email addresses, phone numbers, M-Pesa transaction codes, and project details.
                    </p>

                    <h3>3. How we use your information</h3>
                    <ul>
                        <li>Match clients with vetted Kenyan talent.</li>
                        <li>Process payments via M-Pesa or other gateways.</li>
                        <li>Send administrative information related to your account or services.</li>
                    </ul>

                    <h3>4. Data retention</h3>
                    <p>
                        We retain your data only as long as needed to deliver the service and to satisfy applicable legal and accounting obligations.
                    </p>

                    <h3>5. Contact us</h3>
                    <p>
                        Questions about this policy? Email{" "}
                        <a href={`mailto:${business.supportEmail}`}>{business.supportEmail}</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
