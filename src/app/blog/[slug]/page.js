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
            <Skeleton className="h-8 w-full my-2 mt-[100px]" />
            <Skeleton className="h-4 w-full my-2" />
            <Skeleton className="h-4 w-full my-2" />
            <Skeleton className="h-4 w-full my-2" />
            <Skeleton className="h-4 w-full my-2" />
            <Skeleton className="h-4 w-full my-2" />
            <Skeleton className="h-4 w-full my-2" />
            <Skeleton className="h-4 w-full my-2" />
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
