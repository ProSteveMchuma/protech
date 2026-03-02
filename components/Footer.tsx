import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="font-serif text-2xl font-bold text-white mb-6 block">
                            RemotePro<span className="text-blue-500">.</span>
                        </Link>
                        <p className="max-w-sm mb-6">
                            Managed remote talent for modern businesses. We vet, manage, and scale your offshore workforce.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Services</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/services/va" className="hover:text-white">Virtual Assistants</Link></li>
                            <li><Link href="/services/social" className="hover:text-white">Social Media Management</Link></li>
                            <li><Link href="/services/content" className="hover:text-white">Content & SEO</Link></li>
                            <li><Link href="/hire" className="hover:text-white">Custom Package</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/apply" className="hover:text-white">Join as Talent</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="/admin" className="hover:text-white">Admin Login</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-900 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; {new Date().getFullYear()} RemotePro Kenya. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="text-slate-600 italic">Built for the future of work.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
