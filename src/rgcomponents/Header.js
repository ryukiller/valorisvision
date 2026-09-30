"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { DarkModeSwitch } from "./DarkModeSwitch"
import FeedBack from "./FeedBack"
import Ticker from "./Ticker"

const NAV = [
    { label: "Calculator", href: "/" },
    { label: "Learn", href: "/learn" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy", href: "/privacy" },
]

export function Header() {
    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-void/80 backdrop-blur-md">
                <div className="flex h-16 items-center justify-between px-4 md:px-6">
                    <Link
                        href="/"
                        title="ValorisVisio — Crypto Scenarios"
                        className="flex items-center gap-3 group"
                    >
                        <Image
                            src="/logoicon.svg"
                            width={36}
                            height={36}
                            alt="ValorisVisio logo"
                            className="drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] group-hover:drop-shadow-[0_0_14px_rgba(0,240,255,0.8)] transition-all"
                        />
                        <span
                            className="glitch font-display text-sm md:text-base font-extrabold tracking-[0.18em] text-foreground"
                            data-text="VALORIS//VISIO"
                        >
                            VALORIS<span className="text-neon-cyan">{'//'}</span>VISIO
                        </span>
                    </Link>

                    <nav className="flex items-center gap-5 md:gap-8">
                        {NAV.map((item, i) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground",
                                    "hover:text-neon-cyan transition-colors relative",
                                    "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-neon-cyan",
                                    "hover:after:w-full after:transition-all after:duration-300"
                                )}
                            >
                                <span className="text-neon-cyan/50">0{i + 1}:</span>{item.label}
                            </Link>
                        ))}
                        <FeedBack />
                        <DarkModeSwitch />
                    </nav>
                </div>
                <Ticker />
            </header>
        </>
    )
}
