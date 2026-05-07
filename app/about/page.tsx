import { HeroAmbient } from "@/components/HeroAmbient";
import { TeamSection } from "@/components/TeamSection";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const metadata = {
    title: "About Us | Pro Remote Tasks",
    description: "Meet the experts behind Pro Remote Tasks. We are ex-procurement officers, legal experts, and bid strategists helping Kenyan SMEs win.",
};

export default function AboutPage() {
    return (
        <>
            {/* ---------------------------------------------------------- */}
            {/*  HERO                                                      */}
            {/* ---------------------------------------------------------- */}
            <section className="relative bg-brand-950 text-white overflow-hidden py-32 md:py-48 min-h-[70vh] flex items-center">
                <HeroAmbient tone="dark" />
                <div className="container mx-auto px-6 lg:px-8 max-w-4xl relative z-10 text-center">
                    <div className="mb-8 inline-flex">
                        <Badge tone="accent" pulse>
                            About PRT
                        </Badge>
                    </div>
                    <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight text-balance mb-8">
                        We level the playing field for Kenyan SMEs.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed text-pretty">
                        We built Pro Remote Tasks because we saw too many brilliant local businesses losing out to paper-pushers. We handle the bureaucracy so you can focus on the work.
                    </p>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  TEAM                                                      */}
            {/* ---------------------------------------------------------- */}
            <TeamSection />

            {/* ---------------------------------------------------------- */}
            {/*  MISSION / CLOSE                                           */}
            {/* ---------------------------------------------------------- */}
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-950 mb-6">
                        Ready to work with us?
                    </h2>
                    <p className="text-slate-600 mb-10 text-lg">
                        Whether you need a dedicated bid strategist or a virtual assistant to handle your back-office, we are here to help your business scale.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <ButtonLink href="/services/tender" variant="primary" size="lg">
                            Explore Tender Services <ArrowRight className="size-4 ml-2" />
                        </ButtonLink>
                        <ButtonLink href="/services/va" variant="outline" className="border-slate-300 text-slate-700" size="lg">
                            Explore VA Services
                        </ButtonLink>
                    </div>
                </div>
            </section>
        </>
    );
}
