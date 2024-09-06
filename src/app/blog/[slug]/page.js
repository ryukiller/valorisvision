import { Suspense } from 'react';
import ClientPost from './ClientPost';

export async function generateMetadata({ params }) {
    // Fetch article data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${params.slug}`);
    const data = await response.json();
    const article = data.success ? data.data : null;

    return {
        title: article ? article.title : 'Article Not Found',
        description: article ? article.description || `Read ${article.title}` : 'Article not found',
        openGraph: article ? {
            title: article.title,
            description: article.description || `Read ${article.title}`,
            images: [{ url: article.imageUrl }],
        } : {},
    };
}

export default function Post({ params }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ClientPost params={params} />
        </Suspense>
    );
}
