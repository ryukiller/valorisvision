"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
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
    const [menuOpen, setMenuOpen] = useState(false)
    const menuId = useId()
    const menuButtonRef = useRef(null)
    const panelRef = useRef(null)
    const previouslyFocusedRef = useRef(null)

    const closeMenu = useCallback(() => {
        setMenuOpen(false)
    }, [])

    const openMenu = useCallback(() => {
        previouslyFocusedRef.current = document.activeElement
        setMenuOpen(true)
    }, [])

    const toggleMenu = useCallback(() => {
        if (menuOpen) {
            closeMenu()
        } else {
            openMenu()
        }
    }, [menuOpen, closeMenu, openMenu])

    // Escape to close, body scroll lock, focus first item when open;
    // restore focus to the menu button when closed.
    useEffect(() => {
        if (!menuOpen) {
            const restoreTarget =
                menuButtonRef.current ?? previouslyFocusedRef.current
            if (
                restoreTarget instanceof HTMLElement &&
                previouslyFocusedRef.current
            ) {
                restoreTarget.focus()
                previouslyFocusedRef.current = null
            }
            return
        }

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault()
                closeMenu()
            }
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        document.addEventListener("keydown", onKeyDown)

        const focusTimer = window.setTimeout(() => {
            const panel = panelRef.current
            if (!panel) return
            const focusable = panel.querySelector(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
            if (focusable instanceof HTMLElement) {
                focusable.focus()
            } else {
                panel.focus()
            }
        }, 0)

        return () => {
            window.clearTimeout(focusTimer)
            document.body.style.overflow = previousOverflow
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [menuOpen, closeMenu])

    // Close when viewport grows to desktop
    useEffect(() => {
        const media = window.matchMedia("(min-width: 768px)")
        const onChange = (event) => {
            if (event.matches) closeMenu()
        }
        media.addEventListener("change", onChange)
        return () => media.removeEventListener("change", onChange)
    }, [closeMenu])

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-void/80 backdrop-blur-md">
                <div className="flex h-16 items-center justify-between px-4 md:px-6">
                    <Link
                        href="/"
                        title="ValorisVisio — Crypto Scenarios"
                        className="flex items-center gap-3 group min-w-0"
                        onClick={closeMenu}
                    >
                        <Image
                            src="/logoicon.svg"
                            width={36}
                            height={36}
                            alt="ValorisVisio logo"
                            className="shrink-0 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] group-hover:drop-shadow-[0_0_14px_rgba(0,240,255,0.8)] transition-all"
                        />
                        <span
                            className="glitch font-display text-sm md:text-base font-extrabold tracking-[0.18em] text-foreground truncate"
                            data-text="VALORIS//VISIO"
                        >
                            VALORIS<span className="text-neon-cyan">{'//'}</span>VISIO
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-5 md:gap-8" aria-label="Primary">
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

                    {/* Mobile controls */}
                    <div className="flex md:hidden items-center gap-2">
                        <DarkModeSwitch />
                        <button
                            ref={menuButtonRef}
                            type="button"
                            className="cyber-cut-sm inline-flex h-10 w-10 items-center justify-center border border-line text-foreground hover:border-neon-cyan/60 hover:text-neon-cyan transition-colors"
                            aria-label={menuOpen ? "Close" : "Menu"}
                            aria-expanded={menuOpen}
                            aria-controls={menuId}
                            onClick={toggleMenu}
                        >
                            {menuOpen ? (
                                <X className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <Menu className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
                <Ticker />
            </header>

            {/* Mobile menu overlay + panel */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] md:hidden",
                    menuOpen ? "pointer-events-auto" : "pointer-events-none"
                )}
                aria-hidden={!menuOpen}
            >
                <button
                    type="button"
                    tabIndex={menuOpen ? 0 : -1}
                    aria-label="Close"
                    className={cn(
                        "absolute inset-0 bg-void/70 backdrop-blur-sm transition-opacity duration-300",
                        menuOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={closeMenu}
                />

                <nav
                    id={menuId}
                    ref={panelRef}
                    tabIndex={-1}
                    aria-label="Mobile"
                    className={cn(
                        "absolute top-0 right-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-line bg-void/95 backdrop-blur-md shadow-[-8px_0_32px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out outline-none",
                        menuOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <div className="flex h-16 items-center justify-between border-b border-line px-4">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                            Menu
                        </span>
                        <button
                            type="button"
                            className="cyber-cut-sm inline-flex h-10 w-10 items-center justify-center border border-line text-foreground hover:border-neon-cyan/60 hover:text-neon-cyan transition-colors"
                            aria-label="Close"
                            onClick={closeMenu}
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
                        {NAV.map((item, i) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMenu}
                                className={cn(
                                    "font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground",
                                    "hover:text-neon-cyan transition-colors py-3 border-b border-line/60"
                                )}
                            >
                                <span className="text-neon-cyan/50 mr-2">0{i + 1}:</span>
                                {item.label}
                            </Link>
                        ))}
                        <div className="mt-6 flex items-center gap-3">
                            <FeedBack />
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}
