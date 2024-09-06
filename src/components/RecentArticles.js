'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecentArticles({ category }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const url = category
                    ? `/api/blog?category=${encodeURIComponent(category)}&page=${currentPage}`
                    : `/api/blog?page=${currentPage}`;
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
            <div className="columns-1 md:columns-3 gap-4 space-y-4">
                {articles.map((article, index) => (

                    <div key={index} className="border rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={400}
                            height={400}
                            className="w-full object-cover"
                        />
                        <div className="p-4">
                            <Link href={`/blog/${article.slug}`} key={article._id}> <h2 className="text-xl font-bold mb-2">{article.title}</h2></Link>
                            <span className="text-xs text-gray-200 border border-gray-200 rounded-full px-2 py-1">{article.category ? article.category : "Uncategorized"} - {new Date(article.createdAt).toLocaleDateString()}</span>
                            <p className="text-gray-400">{article.summary}</p>
                        </div>
                    </div>

                ))}
            </div>
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
        </>
    );
}