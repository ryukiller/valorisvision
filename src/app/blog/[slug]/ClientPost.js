'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Sidebar from './Sidebar';
import Head from 'next/head';

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

    if (!article) {
        return <div>Article not found</div>;
    }

    return (
        <>
            <Head>
                {article.imageUrl && (
                    <link
                        rel="preload"
                        as="image"
                        href={article.imageUrl}
                        imagesrcset={`${article.imageUrl} 1x, ${article.imageUrl2x || article.imageUrl} 2x`}
                        fetchpriority="high"
                    />
                )}
            </Head>
            <article className="container mx-auto px-4 py-8 main-content">
                <div className="mt-[100px] flex flex-col md:flex-row items-start gap-4 w-full">

                    <div className="w-full md:w-8/12 prose lg:prose-xl">
                        <span className="text-xs text-gray-200 border border-gray-200 rounded-full px-2 py-1">{article.category ? article.category : "Uncategorized"} - {new Date(article.createdAt).toLocaleDateString()}</span>
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={800}
                            height={800}
                            priority={true}
                            className={`block md:hidden w-full object-cover mb-2 mr-4 transition-all duration-300 ${isScrolled ? 'h-44' : 'h-96'}`}
                        />
                        <ReactMarkdown>{article.article_content}</ReactMarkdown>
                    </div>
                    <div
                        ref={sidebarRef}
                        className={`w-full md:w-4/12 sidebar sticky top-[100px] self-start`}
                    >
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={800}
                            height={800}
                            className={`hidden md:block w-full object-cover mb-2 mr-4 transition-all duration-300 ${isScrolled ? 'h-44' : 'h-96'}`}
                        />
                        <Sidebar currentArticle={article} />
                    </div>
                </div>
            </article>
        </>
    );
}
