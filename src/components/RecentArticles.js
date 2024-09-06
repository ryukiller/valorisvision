'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
export default function RecentArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const response = await fetch('/api/blog');
                const data = await response.json();
                if (data.success) {
                    setArticles(data.data);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchArticles();
    }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (

                <div key={index} className="border rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <Link href={`/blog/${article.slug}`} key={article._id}> <h2 className="text-xl font-bold mb-2">{article.title}</h2></Link>
                        <p className="text-gray-400">{article.summary}</p>
                    </div>
                </div>

            ))}
        </div>
    );
}