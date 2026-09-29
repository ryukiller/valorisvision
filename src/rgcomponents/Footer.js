import Image from "next/image"
import Link from "next/link"

export function Footer() {
    const year = new Date()

    return (
        <footer className="w-full mt-20 border-t border-line bg-void/60">
            <div className="w-full max-w-6xl mx-auto px-6 pt-12 pb-8 flex flex-col lg:flex-row items-start justify-between gap-10">
                <div className="lg:max-w-[38%] flex flex-col gap-4">
                    <span
                        className="glitch font-display text-lg font-extrabold tracking-[0.18em] text-foreground"
                        data-text="VALORIS//VISIO"
                    >
                        VALORIS<span className="text-neon-cyan">{'//'}</span>VISIO
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Your terminal for crypto scenario simulation. Compare your holdings against
                        any project&apos;s market cap and visualize the gains that could be out there.
                    </p>
                    <p className="term-label">{'// est. for the grid'}</p>
                </div>

                <div className="lg:max-w-[30%] flex flex-col gap-3">
                    <span className="term-label">{'// navigate'}</span>
                    {[
                        { label: "Scenario Calculator", href: "/" },
                        { label: "Blog", href: "/blog" },
                        { label: "Privacy Policy", href: "/privacy" },
                        { label: "Cookie Policy", href: "/cookies" },
                    ].map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="font-mono text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
                        >
                            <span className="text-neon-magenta/70 mr-2">›</span>
                            {l.label}
                        </Link>
                    ))}
                </div>

                <div className="lg:max-w-[24%] flex flex-col gap-4 items-start lg:items-end">
                    <span className="term-label">{'// connect'}</span>
                    <div className="flex flex-row gap-3">
                        <Link
                            rel="nofollow"
                            href="https://twitter.com/ValorisVisio"
                            target="_blank"
                            aria-label="Twitter"
                            title="Twitter"
                            className="cyber-cut-sm border border-line p-3 hover:border-neon-cyan/60 hover:shadow-neon-cyan transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 1200 1227" className="text-foreground">
                                <path d="M714.163 519.284L1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026zM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026z" />
                            </svg>
                        </Link>
                        <Link
                            rel="nofollow"
                            href="https://github.com/ryukiller/valorisvision"
                            target="_blank"
                            aria-label="GitHub repository"
                            title="GitHub repository"
                            className="cyber-cut-sm border border-line p-3 hover:border-neon-magenta/60 hover:shadow-neon-magenta transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-line/60 py-5 px-6 text-center">
                <p className="font-mono text-xs text-muted-foreground tracking-widest">
                    © {year.getFullYear()} VALORIS{'//'}VISIO — ALL RIGHTS RESERVED
                    <span className="text-neon-acid ml-3">▮</span>
                </p>
            </div>
        </footer>
    )
}
