"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Layout, Smartphone, Globe, BarChart } from "lucide-react";
import Link from "next/link";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
    link,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    link?: string;
}) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 shadow-sm",
                className
            )}
        >
            <Link href={link || "#"} className="flex flex-col h-full justify-between">
                {header}
                <div className="group-hover/bento:translate-x-2 transition duration-200">
                    {icon}
                    <div className="font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                        {title}
                    </div>
                    <div className="font-normal text-neutral-600 text-xs dark:text-neutral-300">
                        {description}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export function PortfolioBento() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-4">
                        Our Best Work
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        Hand-picked projects that define the new standard.
                    </p>
                </div>

                <BentoGrid className="max-w-6xl mx-auto">
                    {items.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            link={item.link}
                            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}

const Skeleton = ({ img }: { img: string }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 overflow-hidden relative">
        <Image
            src={img}
            alt="Portfolio"
            fill
            className="object-cover transition-transform duration-500 group-hover/bento:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover/bento:bg-black/0 transition-colors" />
    </div>
);

const items = [
    {
        title: "FinTech Nexus",
        description: "A high-performance investment platform built with Next.js and secure banking integration.",
        header: <Image src="/portfolio/project1.png" alt="FinTech Project" width={500} height={300} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover/bento:scale-105" />,
        icon: <BarChart className="h-4 w-4 text-neutral-500" />,
        link: "/services/web-design",
    },
    {
        title: "Safari Logistics",
        description: "Real-time fleet tracking dashboard and logistics management system.",
        header: <Image src="/portfolio/project3.png" alt="Logistics Project" width={500} height={300} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover/bento:scale-105" />, // Temporarily using project3 (agri) or we can wait for project2
        icon: <Globe className="h-4 w-4 text-neutral-500" />,
        link: "/services/automation",
    },
    {
        title: "HarvestHub",
        description: "Mobile-first marketplace connecting farmers to buyers across Kenya.",
        header: <Image src="/portfolio/project3.png" alt="AgriTech Project" width={500} height={300} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover/bento:scale-105" />,
        icon: <Smartphone className="h-4 w-4 text-neutral-500" />,
        link: "/services/web-design",
    },
    {
        title: "BuildCon Tender Strategy",
        description: "Complete tender document preparation that won a KES 50M government contract.",
        header: <Image src="/portfolio/project4.png" alt="Tender Project" width={500} height={300} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover/bento:scale-105" />,
        icon: <Layout className="h-4 w-4 text-neutral-500" />,
        link: "/services/tenders",
    },
    {
        title: "Elite Branding Suite",
        description: "Rebranding campaign for a top law firm, including print and digital assets.",
        header: <Image src="/portfolio/project5.png" alt="Branding Project" width={500} height={300} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover/bento:scale-105" />,
        icon: <ArrowRight className="h-4 w-4 text-neutral-500" />,
        link: "/services/branding",
    },
];
