import RecentArticles from '@/components/RecentArticles';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    return {
        title: `Articles in ${slug}`,
        description: `Articles in ${slug}`,
        robots: {
            index: false,
            follow: true,
        },
        openGraph: {
            title: `Articles in ${slug}`,
            description: `Articles in ${slug}`,
        }
    };
}

export default async function Blog({ params }) {
    const { slug } = await params;

    return (
        <div className="container mx-auto px-4 py-8 main-content">
            <h1 className="text-3xl font-bold mb-8 pt-[150px]">Recent Articles in {slug}</h1>
            <RecentArticles category={slug} />
        </div>
    );
}