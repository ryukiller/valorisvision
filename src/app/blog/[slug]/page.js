import { Suspense } from 'react';
import ClientPost from './ClientPost';
import { Skeleton } from '@/components/ui/skeleton';
export async function generateMetadata({ params }) {
    // Fetch article data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${params.slug}`);
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

                <div className="w-full md:w-8/12 prose lg:prose-xl">
                    <span className="text-xs text-gray-200 border border-gray-200 rounded-full px-2 py-1">Category</span>
                    <div

                        className={`min-w-[345px] min-h-[385px] block md:hidden w-full object-cover mb-2 mr-4 transition-all duration-300`}
                    />
                    <div className="w-full min-h-[200px]"></div>
                </div>
            </div>

        </article>
    );
}


export default function Post({ params }) {
    return (
        <Suspense fallback={<Loading />}>
            <ClientPost params={params} />
        </Suspense>
    );
}
