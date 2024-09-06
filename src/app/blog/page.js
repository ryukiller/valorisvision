import RecentArticles from '@/components/RecentArticles';

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
            <h1 className="text-3xl font-bold mb-8 pt-[100px]">Recent Articles</h1>
            <RecentArticles />
        </div>
    );
}
