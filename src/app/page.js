'use client'
import Link from 'next/link'
import ModernCalculator from '@/components/ModernCalculator'
import Image from 'next/image'
import RecentArticles from '@/components/RecentArticles'
import { motion } from 'framer-motion'

const STEPS = [
  {
    step: "01",
    title: "Enter Your Holdings",
    description: "Input the tokens or coins you currently own. Every major cryptocurrency, backed by real-time data.",
    color: "text-neon-acid",
    border: "group-hover:border-neon-acid/60",
  },
  {
    step: "02",
    title: "Select Your Asset",
    description: "Pick your current cryptocurrency from a database of 1000+ coins and tokens, updated live.",
    color: "text-neon-cyan",
    border: "group-hover:border-neon-cyan/60",
  },
  {
    step: "03",
    title: "Set Your Target",
    description: "Choose any project whose market cap is your goal. Dream big or stay grounded — your call.",
    color: "text-neon-magenta",
    border: "group-hover:border-neon-magenta/60",
  },
  {
    step: "04",
    title: "Visualize Gains",
    description: "Instant, precise simulation: potential returns, percentage gains, and what the grid says next.",
    color: "text-neon-amber",
    border: "group-hover:border-neon-amber/60",
  },
]

const FEATURES = [
  { icon: "⚡", title: "Real-Time Data", text: "Live market data from CoinGecko keeps every calculation accurate and current." },
  { icon: "◈", title: "Smart Analytics", text: "Advanced math turns raw market caps into a clear picture of potential returns." },
  { icon: "▚", title: "Neon Interface", text: "A cyberpunk-grade interface that makes complex scenarios feel like a game." },
  { icon: "▟", title: "Mobile Optimized", text: "Flawless across every screen — desktop, tablet, and phone." },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ============ HERO ============ */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden border-b border-line"
      >
        <div className="absolute inset-0">
          <Image
            priority
            src="/shibnew.webp"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-30"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-void/75 to-void" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/40 via-transparent to-void/40" />
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center"
        >
          <p className="term-label mb-6 flex items-center justify-center gap-3 text-neon-cyan/80">
            <span className="w-8 h-px bg-neon-cyan/60" />
            {'// valorisvisio scenario calculator'}
            <span className="w-8 h-px bg-neon-cyan/60" />
          </p>
          {/* No .glitch here: nested spans + line breaks fight the data-text overlay */}
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-foreground [text-shadow:0_2px_24px_rgba(5,6,12,0.9),0_0_1px_rgba(255,255,255,0.35)]">
            CRYPTO <span className="text-neon-cyan [text-shadow:0_0_18px_rgba(0,240,255,0.45),0_2px_12px_rgba(5,6,12,0.8)]">PROFIT</span>
            <br />
            &amp; <span className="text-neon-magenta [text-shadow:0_0_18px_rgba(255,46,136,0.4),0_2px_12px_rgba(5,6,12,0.8)]">SCENARIO</span>{" "}
            CALCULATOR
          </h1>
          <p className="mt-8 text-base md:text-lg text-foreground/90 max-w-2xl mx-auto [text-shadow:0_1px_12px_rgba(5,6,12,0.85)]">
            ValorisVisio&apos;s free crypto market cap calculator lets you model what-if profits:
            compare your holdings against another project&apos;s market cap with live data.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#calculator"
              className="cta-primary px-8 py-4"
            >
              Launch Terminal
            </a>
            <Link
              href="/learn/crypto-profit-calculator/market-cap-scenarios-explained"
              className="cta-secondary px-8 py-4"
            >
              How scenarios work
            </Link>
          </div>
        </motion.div>
      </motion.section>

      {/* ============ CALCULATOR ============ */}
      <section id="calculator" className="py-16 scroll-mt-24">
        <ModernCalculator />
      </section>

      {/* ============ SOFT LEARN CTA ============ */}
      <section className="pb-12">
        <div className="container px-4">
          <p className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
            New to market-cap what-ifs?{' '}
            <Link
              href="/learn/crypto-profit-calculator/market-cap-scenarios-explained"
              className="text-neon-cyan hover:underline"
            >
              Read how to use a crypto market cap scenario calculator
            </Link>
            {' '}
            — circulating supply vs FDV, ROI math, and practical checks — then come back to the tool.
          </p>
        </div>
      </section>

      {/* ============ LATEST ARTICLES ============ */}
      <section className="py-16 border-y border-line bg-panel/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="term-label mb-3">{'// latest_drops'}</p>
            <h2 className="section-title">
              Latest Crypto <span className="text-neon-cyan">Insights</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Signal from the noise — market analysis and investment intelligence, decoded.
            </p>
          </motion.div>
          <RecentArticles count="16" />
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="term-label mb-3">{'// protocol'}</p>
              <h2 className="section-title">
                How the <span className="text-neon-magenta">Simulation</span> Works
              </h2>
              <p className="mt-3 text-muted-foreground">
                Four moves to map your holdings against the market grid.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`cyber-frame group relative p-6 border border-line bg-panel/60 ${item.border} transition-colors duration-300`}
                >
                  <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
                    [ {item.step} ]
                  </div>
                  <h3 className={`font-display text-lg font-bold mb-3 ${item.color}`}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-16 cyber-frame relative p-8 border border-line bg-gradient-to-br from-panel to-void"
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="text-neon-acid text-xl">◈</span>
                <h3 className="section-title text-xl md:text-2xl">
                  Why the Grid <span className="text-neon-cyan">Chooses</span> ValorisVisio
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {FEATURES.map((f) => (
                  <div key={f.title} className="flex items-start gap-4">
                    <span className="font-mono text-neon-cyan text-lg mt-0.5">{f.icon}</span>
                    <div>
                      <h4 className="font-mono text-sm font-semibold tracking-wider text-foreground mb-1 uppercase">
                        {f.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ SEO CONTENT ============ */}
      <section className="py-16 border-t border-line bg-panel/20">
        <div className="container px-4">
          <div className="main-content max-w-6xl mx-auto text-left">
            <Image src="/innerimage.webp" className="float-left mr-6 mb-4 cyber-cut-sm border border-line" width={400} height={400} alt="ValorisVisio crypto profit and market cap scenario calculator" />
            <h2 className="font-display text-2xl font-bold my-2">ValorisVisio crypto profit &amp; market cap scenario calculator</h2>
            <h3>Model holdings with a crypto scenario calculator</h3>
            <p>ValorisVisio is a free crypto profit calculator built around market-cap what-ifs. Enter your holdings, pick a target project, and see an illustrative bag value if your asset&apos;s market capitalization moved toward that target — powered by live CoinGecko data, not hype charts.</p>
            <h3>Market-cap what-ifs, explained in practice</h3>
            <p>Input your current crypto holdings and select a target project. The crypto market cap calculator shows what those holdings could be worth under the chosen scenario. For circulating supply vs FDV and ROI caveats, see our{' '}
              <Link href="/learn/crypto-profit-calculator/market-cap-scenarios-explained" className="text-neon-cyan hover:underline">
                market cap scenario guide
              </Link>
              .</p>
            <h3>How the Crypto Scenario Calculator Ignites Your Investment Passion:</h3>
            <p>The secret sauce of ValorisVisio&apos;s Calculator is its ability to make complex calculations feel like a treasure hunt. It uses real-time data, market trends, and historical performances to give you a glimpse into the future of your investments. This isn&apos;t about dry predictions; it&apos;s about experiencing the thrill of seeing your potential gains come to life on your screen.</p>
            <h3>Beyond Calculation: Empowering Your Investment Strategy with ValorisVisio:</h3>
            <p>But it&apos;s not all about the excitement. The Crypto Scenario Calculator is a powerful ally in your investment journey. It helps you understand market dynamics, assess risk, and plan with more confidence. By seeing potential outcomes, you&apos;re equipped to make smarter, more informed decisions about your crypto portfolio.</p>
            <h3>Conclusion: Your Journey to Crypto Mastery Begins with ValorisVisio:</h3>
            <p>ValorisVisio is more than an app; it&apos;s a revolution in how you view your crypto investments. It transforms the complex world of cryptocurrency into an exhilarating journey of discovery. Whether you&apos;re a seasoned investor or just starting out, ValorisVisio&apos;s Crypto Scenario Calculator is your ticket to experiencing the thrill of potential wealth in the crypto market. Embrace the excitement, and let your crypto dreams take flight with ValorisVisio.</p>
            <Image src="/shib.webp" className="float-right m-6 cyber-cut-sm border border-line" width={600} height={400} alt="ValorisVisio: Unleash the Power of Your Crypto Holdings with Our Revolutionary Crypto Scenario Calculator" />
            <h3>Crypto Scenarios Calculator: Unleash the Power of Strategic Crypto Investment</h3>
            <p>In the ever-evolving world of cryptocurrency, the need for a dynamic and intuitive tool like the <strong>Crypto Scenarios Calculator</strong> cannot be overstated. This tool is a game-changer for investors seeking to navigate the complexities of cryptocurrency markets with confidence and clarity.</p>
            <h3>Discover the Magic of the Crypto Scenarios Calculator</h3>
            <p>The <strong>Crypto Scenarios Calculator</strong> is not just a tool; it&apos;s your gateway to mastering the art of crypto investment. It provides a thrilling visual and analytical journey through your crypto holdings, turning the usual stress of market analysis into an engaging and insightful experience. The <strong>Crypto Scenarios Calculator</strong> makes understanding your portfolio&apos;s potential not just easy, but exciting.</p>
            <h3>How the Crypto Scenarios Calculator Transforms Your Investment Strategy</h3>
            <p>The <strong>Crypto Scenarios Calculator</strong> excels in breaking down complex market data into understandable and actionable insights. By harnessing the advanced algorithms of the <strong>Crypto Scenarios Calculator</strong>, investors can vividly see the potential growth of their crypto investments. This isn&apos;t just number-crunching; it&apos;s a strategic tool that empowers you to make informed decisions.</p>
            <h3>Experience the Excitement with Crypto Scenarios Calculator</h3>
            <p>Each interaction with the <strong>Crypto Scenarios Calculator</strong> is an adventure. It visualizes various investment scenarios, offering a glimpse into the potential future of your portfolio. The excitement of uncovering the possibilities within your crypto investments is what sets the <strong>Crypto Scenarios Calculator</strong> apart.</p>
            <Image src="/shibimg.webp" className="float-left m-6 ml-0 cyber-cut-sm border border-line" width={600} height={400} alt="ValorisVisio: Unleash the Power of Your Crypto Holdings with Our Revolutionary Crypto Scenario Calculator" />
            <h3>Crypto Scenarios Calculator: Unleash the Power of Strategic Crypto Investment</h3>
            <h3>Comprehensive Features of the Crypto Scenarios Calculator</h3>
            <p>The <strong>Crypto Scenarios Calculator</strong> goes beyond mere calculations. It&apos;s a comprehensive suite equipped with features tailored for the modern crypto investor:</p>
            <ol>
              <li><strong>Dynamic Market Analysis</strong>: The <strong>Crypto Scenarios Calculator</strong> navigates through market trends to predict potential impacts on your investments.</li>
              <li><strong>In-depth Risk Assessment</strong>: With the <strong>Crypto Scenarios Calculator</strong>, balance risk and potential gains effortlessly.</li>
              <li><strong>Strategic Planning</strong>: The tool offers visualizations of various investment strategies, enhancing your decision-making process.</li>
              <li><strong>Real-Time Data Integration</strong>: The <strong>Crypto Scenarios Calculator</strong> stays updated with the latest market changes, keeping your strategy sharp and informed.</li>
            </ol>
            <h3>Empowerment through the Crypto Scenarios Calculator</h3>
            <p>The <strong>Crypto Scenarios Calculator</strong> is not just about managing investments; it&apos;s about empowering investors with the knowledge and foresight to make smart, strategic decisions. The tool is designed to help you strike the perfect balance between caution and ambition in your crypto trading endeavors.</p>
            <h3>The Indispensable Crypto Scenarios Calculator</h3>
            <p>In a market where timing and information are everything, the <strong>Crypto Scenarios Calculator</strong> is your indispensable ally. It&apos;s not just an analytical tool; it&apos;s a comprehensive solution for the savvy crypto investor.</p>
            <h3>Embrace the Future with the Crypto Scenarios Calculator</h3>
            <p>The <strong>Crypto Scenarios Calculator</strong> represents a new era in cryptocurrency investment. It is an essential tool for anyone looking to make informed, strategic, and successful crypto investments. Dive into the world of cryptocurrency with confidence and excitement, backed by the unparalleled capabilities of the <strong>Crypto Scenarios Calculator</strong>.</p>
            <Image src="/hero.webp" className="mt-10 w-full cyber-cut border border-line" width={1600} height={600} alt="Ever wonder what your bag value will be if your crypto holdings market cap matches another crypto project? Here you can visualize your potential gains in that possible scenario, just input your holdings and select your target crypto project, and visualize how much your current holdings value would be in that case." />
          </div>
        </div>
      </section>
    </main>
  )
}
