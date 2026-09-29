"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
export default function Sidebar({ currentArticle }) {

    const [recentPosts, setRecentPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/?category=${currentArticle.category_slug}`);
                const data = await response.json();
                // Check if data is an array before filtering
                if (Array.isArray(data.data)) {
                    const filteredPosts = data.data.filter(post => post.slug !== currentArticle.slug);
                    setRecentPosts(filteredPosts);
                } else {
                    console.error('Received data is not an array:', data);
                    setRecentPosts([]);
                }
            } catch (error) {
                console.error('Error fetching recent posts:', error);
                setRecentPosts([]);
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/?getCategories=true`);
                const data = await response.json();
                // Filter out empty values
                const filteredCategories = data.data.filter(category => category && Object.keys(category).length > 0);
                setCategories(filteredCategories);
            } catch (error) {
                console.error('Error fetching category posts:', error);
                setCategories([]);
            }
        }
        fetchRecentPosts();
        fetchCategories();
    }, [currentArticle.slug, currentArticle.category_slug]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 border border-line bg-panel/50 p-5 cyber-cut-sm">
                <span className="block font-mono text-[11px] uppercase tracking-[0.3em] text-neon-cyan mb-2">{'// categories'}</span>
                <ul className="flex flex-col">
                    {categories.map((category) => (
                        <li key={category.id}>
                            <Link href={`/blog/category/${category.slug}`}>
                                <span className="block text-sm font-medium m-1 text-muted-foreground hover:text-neon-cyan transition-colors">
                                    <span className="text-neon-magenta/70 mr-2">›</span>{category.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-3 border border-line bg-panel/50 p-5 cyber-cut-sm">
                <span className="block font-mono text-[11px] uppercase tracking-[0.3em] text-neon-cyan">{'// more_in: '}{currentArticle.category || 'grid'}</span>
                <ul className="flex flex-col gap-3">
                    {recentPosts.map((post) => (
                        <li key={post.id} className="flex flex-row items-center gap-3 border border-line bg-void/40 p-2 hover:border-neon-cyan/50 transition-colors">
                            <Image src={post.imageUrl} alt={post.title} width={100} height={100} className="w-16 h-16 object-cover cyber-cut-sm" />
                            <Link href={`/blog/${post.slug}`}><span className="block text-sm font-medium text-foreground line-clamp-2">{post.title}</span></Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}