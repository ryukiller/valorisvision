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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 pt-[100px]">
                <p className="term-label mb-3">{'// channel: '}{slug}</p>
                <h1 className="glitch font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground" data-text={`RECENT ARTICLES IN ${slug.toUpperCase()}`}>
                    RECENT ARTICLES IN <span className="text-neon-cyan">{slug.toUpperCase()}</span>
                </h1>
            </div>
            <RecentArticles category={slug} />
        </div>
    );
}