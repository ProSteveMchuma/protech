"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    const [meteors, setMeteors] = useState<number[]>([]);

    useEffect(() => {
        const styles = [...new Array(20)].map(() => Math.random());
        setMeteors(styles);
    }, []);

    return (
        <div
            className={cn(
                "absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-transparent pointer-events-none overflow-hidden",
                className
            )}
        >
            {/* Base Gradients */}
            <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="absolute left-0 top-0 h-full w-full overflow-hidden opacity-40">
                <div className="absolute -left-1/4 -top-1/2 h-[200%] w-[200%] animate-[spin_60s_linear_infinite] rounded-[100%] bg-gradient-to-b from-transparent via-primary/5 to-transparent blur-3xl opacity-50" />
                <div className="absolute -right-1/4 -bottom-1/2 h-[200%] w-[200%] animate-[spin_45s_linear_infinite_reverse] rounded-[100%] bg-gradient-to-b from-transparent via-secondary/5 to-transparent blur-3xl opacity-50" />
            </div>

            {/* Meteors */}
            {meteors.map((el, idx) => (
                <span
                    key={"meteor" + idx}
                    className={cn(
                        "animate-[meteor_5s_linear_infinite] absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
                        "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
                        className
                    )}
                    style={{
                        top: Math.floor(Math.random() * (100 - -20) + -20) + "%", // Random top position
                        left: Math.floor(Math.random() * (100 - -20) + -20) + "%", // Random left position
                        animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
                        animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
                    }}
                />
            ))}
        </div>
    );
};
