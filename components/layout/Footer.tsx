import Link from "next/link"
import { Code2, Github, Twitter, Linkedin, Mail, MapPin, Phone, MessageCircle } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-background pt-16 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tight text-foreground">ProTech</span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm font-medium leading-relaxed">
                            Empowering businesses with cutting-edge web development, mobile solutions,
                            and digital innovation. We build the future.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Twitter className="size-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="size-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Linkedin className="size-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="font-semibold text-foreground tracking-tight">Services</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                            <li><Link href="/services#web" className="hover:text-foreground transition-colors">Web Development</Link></li>
                            <li><Link href="/services#app" className="hover:text-foreground transition-colors">Mobile Apps</Link></li>
                            <li><Link href="/services#cloud" className="hover:text-foreground transition-colors">Cloud Solutions</Link></li>
                            <li><Link href="/services#uiux" className="hover:text-foreground transition-colors">UI/UX Design</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="font-semibold text-foreground tracking-tight">Contact</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                            <li className="flex items-start gap-3">
                                <span>Machakos, Kenya</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span>0715 947 213</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <a href="mailto:info@proinnovationtech.co.ke" className="hover:text-foreground transition-colors">
                                    info@proinnovationtech.co.ke
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground/60">
                    <p>© {new Date().getFullYear()} Pro Innovation & Technologies.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
