import RecentArticles from '@/components/RecentArticles'
import Breadcrumbs from '@/components/Breadcrumbs'

export async function generateMetadata({ params }) {
    return {
        title: "Crypto Insights: Latest News and Analysis on Cryptocurrencies",
        description: "Stay informed with our expert analysis, market trends, and in-depth articles on Bitcoin, Ethereum, and emerging cryptocurrencies. Your go-to source for crypto knowledge.",
        openGraph: {
            title: "Crypto Insights: Latest News and Analysis on Cryptocurrencies",
            description: "Expert analysis, market trends, and in-depth articles on Bitcoin, Ethereum, and emerging cryptocurrencies.",
        }
    };
}

export default function Blog() {
    return (
        <div className="container mx-auto px-4 py-8 main-content">
            <div className="pt-[100px] mb-10">
                <Breadcrumbs items={[{ label: 'Blog' }]} />
                <p className="term-label mb-3">{'// grid_transmissions'}</p>
                <h1 className="glitch font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4" data-text="CRYPTO INSIGHTS & ANALYSIS">
                    CRYPTO <span className="text-neon-cyan">INSIGHTS</span> & <span className="text-neon-magenta">ANALYSIS</span>
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl">
                    Signal from the noise — the latest cryptocurrency news, market trends, and expert analysis to make sharper investment decisions.
                </p>
            </div>
            <RecentArticles />
        </div>
    )
}
