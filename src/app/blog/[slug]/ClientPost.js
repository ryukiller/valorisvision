'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Sidebar from './Sidebar';

export default function ClientPost({ slug }) {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        async function fetchArticle() {
            try {
                // Use the full URL here, including the base URL
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${slug}`);
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
    }, [slug]);

    if (loading) {
        return (

            <article className="container mx-auto px-4 py-8 main-content">

                <div className="mt-[100px] flex flex-col md:flex-row items-start gap-4 w-full">

                    <div className="w-full md:w-8/12 prose-cyber">
                        <span className="inline-block font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground border border-line px-3 py-1.5">Category</span>
                        <div
                            className="min-w-[345px] min-h-[385px] block md:hidden w-full object-cover mb-2 mr-4 transition-all duration-300 border border-line"
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
        <article className="container mx-auto px-4 py-8 main-content">
            <div className="mt-[100px] flex flex-col md:flex-row items-start gap-4 w-full">

                <div className="w-full md:w-8/12 prose-cyber cyber-frame border border-line bg-panel/40 p-6 md:p-10">
                    <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
                        <span className="border border-neon-magenta/50 text-neon-magenta px-3 py-1.5">
                            {article.category ? article.category : "Uncategorized"}
                        </span>
                        <span className="text-neon-cyan/70">{new Date(article.createdAt).toLocaleDateString()}</span>
                        <span className="hidden sm:inline text-muted-foreground/50">{'// decrypting signal'}</span>
                    </div>
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={800}
                        height={800}
                        priority={true}
                        className={`block md:hidden w-full object-cover mb-2 mr-4 transition-all duration-300 border border-line ${isScrolled ? 'h-44' : 'h-96'}`}
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
                        className={`hidden md:block w-full object-cover mb-2 mr-4 transition-all duration-300 border border-line ${isScrolled ? 'h-44' : 'h-96'}`}
                    />
                    <Sidebar currentArticle={article} />
                </div>
            </div>
        </article>
    );
}
