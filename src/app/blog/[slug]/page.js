import { Suspense } from 'react';
import ClientPost from './ClientPost';
export async function generateMetadata({ params }) {
    // Fetch article data
    const { slug } = await params;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${slug}`);
    const data = await response.json();
    const article = data.success ? data.data : null;

    return {
        title: article ? article.seo_title || article.title : 'Article Not Found',
        description: article ? article.seo_description || `Read ${article.title}` : 'Article not found',
        openGraph: article ? {
            title: article.seo_title || article.title,
            description: article ? article.seo_description || `Read ${article.title}` : 'Article not found',
            images: [{ url: article.imageUrl }],
        } : {},
    };
}

const Loading = () => {
    return (
        <article className="container mx-auto px-4 py-8 main-content">
            <div className="mt-[100px] flex flex-col md:flex-row items-start gap-4 w-full">

                <div className="w-full md:w-8/12 prose-cyber">
                    <span className="inline-block font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground border border-line px-3 py-1.5">Category</span>
                    <div

                        className={`min-w-[345px] min-h-[385px] block md:hidden w-full object-cover mb-2 mr-4 transition-all duration-300`}
                    />
                    <div className="w-full min-h-[200px]"></div>
                </div>
            </div>

        </article>
    );
}


export default async function Post({ params }) {
    const { slug } = await params;
    return (
        <Suspense fallback={<Loading />}>
            <ClientPost slug={slug} />
        </Suspense>
    );
}
