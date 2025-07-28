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
                    console.log(data);

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
    }, [category, currentPage]);

    if (loading) {
        const articles = [1, 2, 3, 4, 5, 6];
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (

                    <div key={index} className="border rounded-lg overflow-hidden shadow-lg">
                        <Skeleton
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <Skeleton className="h-6 w-[250px] text-xl font-bold mb-2" />
                            <div className="text-gray-400">
                                <Skeleton className="h-4 w-full  my-2" />
                                <Skeleton className="h-4 w-full my-2" />
                                <Skeleton className="h-4 w-[300px] my-2" />
                                <Skeleton className="h-4 w-[250px] my-2" />
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
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <div className="relative overflow-hidden">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                width={400}
                                height={240}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-3 left-3">
                                <Badge variant="secondary" className="backdrop-blur-sm bg-white/20 text-white border-white/30 text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {article.category || "Crypto"}
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="p-5">
                            <Link href={`/blog/${article.slug}`} className="block group-hover:text-blue-600 transition-colors duration-200">
                                <h2 className="text-lg font-bold mb-3 line-clamp-2 leading-tight text-gray-800 dark:text-gray-200">
                                    {article.title}
                                </h2>
                            </Link>
                            
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                                {article.summary}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>5 min read</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </motion.div>
                ))}
            </div>
            {!count && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
}