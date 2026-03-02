import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8">
                    <ArrowLeft className="size-4 mr-2" /> Back to Home
                </Link>
                <h1 className="font-serif text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

                <div className="prose prose-slate max-w-none">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Introduction</h3>
                    <p>
                        Welcome to RemotePro ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                    </p>

                    <h3>2. Information We Collect</h3>
                    <p>
                        We collect personal information that you voluntarily provide to us when you apply for jobs or request services. This includes names, email addresses, phone numbers, and payment information.
                    </p>

                    <h3>3. How We Use Your Information</h3>
                    <p>
                        We use your personal information to:
                    </p>
                    <ul>
                        <li>Facilitate the hiring process between clients and talent.</li>
                        <li>Process payments via M-Pesa or other gateways.</li>
                        <li>Send you administrative information.</li>
                    </ul>

                    <h3>4. Contact Us</h3>
                    <p>
                        If you have questions about this policy, please contact us at privacy@remotepro.co.ke.
                    </p>
                </div>
            </div>
        </div>
    );
}
