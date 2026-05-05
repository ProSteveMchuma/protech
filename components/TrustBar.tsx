const partners = [
    "Nairobi Properties",
    "Mombasa Logistics",
    "Westlands Health",
    "Karen Capital",
    "Eastleigh Trade Co.",
    "Rift Valley Agro",
    "Kilimani Studios",
    "Coast Tours KE",
];

export function TrustBar() {
    const items = [...partners, ...partners];
    return (
        <section className="py-12 border-y border-slate-200/70 bg-white">
            <div className="mx-auto max-w-7xl px-4">
                <p className="text-center text-xs uppercase tracking-[0.25em] font-semibold text-slate-500 mb-6">
                    Trusted by founders across Kenya, the UK, and the diaspora
                </p>
                <div className="overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                    <div className="flex gap-12 animate-marquee whitespace-nowrap w-max">
                        {items.map((p, i) => (
                            <span
                                key={i}
                                className="font-display text-2xl font-bold text-slate-300 hover:text-slate-500 transition"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
