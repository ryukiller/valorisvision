'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton"
import Sidebar from './Sidebar';

export default function ClientPost({ params }) {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        async function fetchArticle() {
            try {
                // Use the full URL here, including the base URL
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${params.slug}`);
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

        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [params.slug]);

    if (loading) {
        return (

            <article className="container mx-auto px-4 py-8 main-content">
                <Skeleton className="h-8 w-full my-2 mt-[100px]" />
                <Skeleton
                    width={800}
                    height={800}
                    className="w-4/12 object-cover mb-2 float-left mr-4"
                />
                <div className="prose lg:prose-xl">
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-full my-2" />

                </div>
            </article>

        );
    }

    if (!article) {
        return <div>Article not found</div>;
    }

    return (
        <article className="container mx-auto px-4 py-8 main-content">
            <div className="mt-[100px] flex flex-row items-start gap-4 w-full">

                <div className="w-8/12 prose lg:prose-xl">
                    <span className="text-xs text-gray-200 border border-gray-200 rounded-full px-2 py-1">{article.category ? article.category : "Uncategorized"} - {new Date(article.createdAt).toLocaleDateString()}</span>
                    <ReactMarkdown>{article.article_content}</ReactMarkdown>
                </div>
                <div
                    ref={sidebarRef}
                    className={`w-4/12 sidebar sticky top-[100px] self-start`}
                >
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={800}
                        height={800}
                        className={`w-full object-cover mb-2 mr-4 transition-all duration-300 ${isScrolled ? 'h-44' : 'h-96'}`}
                    />
                    <Sidebar currentArticle={article} />
                </div>
            </div>
        </article>
    );
}
