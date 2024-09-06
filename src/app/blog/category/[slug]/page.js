import RecentArticles from '@/components/RecentArticles';

export async function generateMetadata({ params }) {
    return {
        title: `Articles in ${params.slug}`,
        description: `Articles in ${params.slug}`,
        robots: {
            index: false,
            follow: true,
        },
        openGraph: {
            title: `Articles in ${params.slug}`,
            description: `Articles in ${params.slug}`,
        }
    };
}

export default function Blog({ params }) {

    return (
        <div className="container mx-auto px-4 py-8 main-content">
            <h1 className="text-3xl font-bold mb-8 pt-[150px]">Recent Articles in {params.slug}</h1>
            <RecentArticles category={params.slug} />
        </div>
    );
}