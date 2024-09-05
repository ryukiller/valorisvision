'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Post({ params }) {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchArticle() {
            try {
                const response = await fetch(`/api/blog/${params.slug}`);
                const data = await response.json();
                if (data.success) {
                    setArticle(data.data);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchArticle();
    }, [params.slug]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!article) {
        return <div>Article not found</div>;
    }

    return (
        <article className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4 mt-[100px]">{article.title}</h1>
            <Image
                src={article.imageUrl}
                alt={article.title}
                width={800}
                height={800}
                className="w-4/12 object-cover mb-2 float-left mr-4"
            />
            <div className="prose lg:prose-xl">
                <ReactMarkdown>{article.article_content}</ReactMarkdown>
            </div>
        </article>
    );
}
