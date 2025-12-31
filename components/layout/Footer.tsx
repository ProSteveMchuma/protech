import Link from "next/link"
import { Code2, Github, Twitter, Linkedin, Mail, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-background pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Code2 className="size-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">ProTech</span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            Empowering businesses with cutting-edge web development, mobile solutions,
                            and digital innovation. We build the future.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href="#" className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
                                <Twitter className="size-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
                                <Github className="size-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
                                <Linkedin className="size-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Services</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/services#web" className="hover:text-primary transition-colors">Web Development</Link></li>
                            <li><Link href="/services#app" className="hover:text-primary transition-colors">Mobile Apps</Link></li>
                            <li><Link href="/services#cloud" className="hover:text-primary transition-colors">Cloud Solutions</Link></li>
                            <li><Link href="/services#uiux" className="hover:text-primary transition-colors">UI/UX Design</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Contact</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="size-5 text-primary shrink-0" />
                                <span>Machakos, Kenya<br />(Online/Remote Focus)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="size-5 text-primary shrink-0" />
                                <a href="mailto:hello@proinnovation.tech" className="hover:text-primary transition-colors">
                                    hello@proinnovation.tech
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Pro Innovation & Technologies. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
