"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
export default function Sidebar({ currentArticle }) {

    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/`);
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
        fetchRecentPosts();
    }, [currentArticle.slug]);

    return (
        <div className="flex flex-col gap-4">
            {/* <h6 className="text-2xl font-bold my-2">Categorie</h6> */}

            <div className="flex flex-col gap-2">
                <h6 className="text-2xl font-bold my-2">Recent Posts</h6>
                {recentPosts.map((post) => (
                    <div key={post.id} className="flex flex-row items-center gap-2 border border-gray-300">
                        <Image src={post.imageUrl} alt={post.title} width={100} height={100} className="w-20 h-20 object-cover rounded-sm" />
                        <Link href={`/blog/${post.slug}`}><h6 className="text-md font-bold m-2">{post.title}</h6></Link>
                    </div>
                ))}
            </div>
        </div>
    );
}