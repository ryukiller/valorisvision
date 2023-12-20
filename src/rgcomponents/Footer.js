import Image from "next/image"
import Link from "next/link";
import { Github, Twitter } from "lucide-react"

export function Footer() {

    const year = new Date();

    return (
        <footer className="flex flex-col w-full dark:border-t-white border-t-black border-t-2 pt-6">
            <div className="footeritems w-full px-6 flex flex-col lg:flex-row items-start justify-between">
                <div className="p-4 lg:max-w-[33%] flex flex-col gap-4">
                    <Image className="dark:brightness-[10]" src="logo.svg" width={200} height={100} alt="ValorisVisio Crypto Scenario Logo" />
                    <p>
                        ValorisVisio, is designed to be an indispensable tool in your cryptocurrency investment journey. It elegantly bridges the gap between your individual holdings and the vast, dynamic world of crypto market capitalizations. With ValorisVisio, you gain the power to compare your crypto assets against the broader market landscape, enabling you to visualize potential gains and understand the relative performance of your investments.
                    </p>
                </div>
                <div className="p-4 lg:max-w-[33%] flex flex-col gap-4"></div>
                <div className="p-4 lg:max-w-[33%] flex flex-row gap-4 justify-end items-end">
                    <Link rel="nofollow" href="https://twitter.com/ValorisVisio" target="_blank" aria-label="Twitter" title="Twitter" className="rounded-full border border-slate-600 dark:boder-white p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="none"
                            viewBox="0 0 1200 1227"
                            className="dark:fill-white fill-black"
                        >
                            <path d="M714.163 519.284L1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026zM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026z"
                            ></path>
                        </svg>
                    </Link>
                    <Link rel="nofollow" href="https://github.com/ryukiller/valorisvision" target="_blank" aria-label="GitHub repository" title="GitHub repository" className="rounded-full border border-slate-600 dark:boder-white p-3">
                        <Github size={32} strokeWidth={1.5} />
                    </Link>
                </div>

            </div>
            <div className="copyright w-full p-4 text-center">
                © All right reserved <Image className="inline" src="logoicon.svg" width={20} height={20} alt="ValorisVisio Crypto Scenario Logo" /> ValorisVisio  {year.getFullYear()} - <Link href="/privacy">Privacy Policy</Link> - <Link href="/cookies">Cookie Policy</Link>
            </div>
        </footer>
    )

}