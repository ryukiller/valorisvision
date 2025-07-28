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
            <div className="pt-[100px] mb-8">
                <Breadcrumbs items={[{ label: 'Blog' }]} />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Crypto Insights & Analysis
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                    Stay informed with the latest cryptocurrency news, market trends, and expert analysis to make better investment decisions.
                </p>
            </div>
            <RecentArticles />
        </div>
    )
}
