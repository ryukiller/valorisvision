'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

export default function RecentArticles({ category, count }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const url = category
                    ? `/api/blog?category=${encodeURIComponent(category)}&page=${currentPage} &limit=${count}`
                    : `/api/blog?page=${currentPage} &limit=${count}`;
                const response = await fetch(url);
                const data = await response.json();
                if (data.success) {
                    setArticles(data.data);
                    setTotalPages(data.pagination.totalPages);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchArticles();
    }, [category, currentPage, count]);

    if (loading) {
        const skeletons = [1, 2, 3, 4, 5, 6];
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skeletons.map((article, index) => (
                    <div key={index} className="border border-line bg-panel/60 cyber-cut overflow-hidden">
                        <Skeleton width={400} height={300} className="w-full h-48 rounded-none" />
                        <div className="p-5">
                            <Skeleton className="h-6 w-[250px] text-xl font-bold mb-2 rounded-none" />
                            <div className="text-muted-foreground">
                                <Skeleton className="h-4 w-full my-2 rounded-none" />
                                <Skeleton className="h-4 w-full my-2 rounded-none" />
                                <Skeleton className="h-4 w-[300px] my-2 rounded-none" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className={`grid grid-cols-1 ${count ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {articles.map((article, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
                        viewport={{ once: true }}
                        className="group relative cyber-frame border border-line bg-panel/60 cyber-cut overflow-hidden hover:border-neon-cyan/50 hover:shadow-neon-cyan transition-all duration-300"
                    >
                        <div className="relative overflow-hidden">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                width={400}
                                height={240}
                                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            {/* duotone veil */}
                            <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-neon-cyan/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute top-3 left-3">
                                <Badge className="bg-void/80 backdrop-blur border border-neon-magenta/50 text-neon-magenta text-[10px] font-mono uppercase tracking-widest rounded-none h-6">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {article.category || "Crypto"}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-5">
                            <Link href={`/blog/${article.slug}`} className="block">
                                <h2 className="font-display text-base font-bold mb-3 line-clamp-2 leading-snug text-foreground group-hover:text-neon-cyan transition-colors duration-200">
                                    {article.title}
                                </h2>
                            </Link>

                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                                {article.summary}
                            </p>

                            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3 text-neon-cyan/70" />
                                    <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 text-neon-magenta/70" />
                                    <span>5 min read</span>
                                </div>
                            </div>
                        </div>

                        {/* neon sweep on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                ))}
            </div>
            {!count && (
                <div className="flex items-center justify-center gap-4 mt-10">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="cyber-cut-sm border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:border-neon-cyan/60 hover:text-neon-cyan disabled:opacity-30 disabled:hover:border-line disabled:hover:text-foreground transition-all"
                    >
                        ‹ Prev
                    </button>
                    <span className="font-mono text-xs text-muted-foreground tracking-widest">
                        [ {currentPage} / {totalPages} ]
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="cyber-cut-sm border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:border-neon-cyan/60 hover:text-neon-cyan disabled:opacity-30 disabled:hover:border-line disabled:hover:text-foreground transition-all"
                    >
                        Next ›
                    </button>
                </div>
            )}
        </>
    );
}
