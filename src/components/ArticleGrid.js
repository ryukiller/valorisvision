import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function ArticleCard({ article }) {
    return (
        <div className="group relative cyber-frame border border-line bg-panel/60 cyber-cut overflow-hidden hover:border-neon-cyan/50 hover:shadow-neon-cyan transition-all duration-300">
            <div className="relative overflow-hidden">
                <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={400}
                    height={240}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
                <div className="absolute inset-0 bg-neon-cyan/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 left-3">
                    <Badge className="bg-void/80 backdrop-blur border border-neon-magenta/50 text-neon-magenta text-[10px] font-mono uppercase tracking-widest rounded-none h-6">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {article.category || 'Crypto'}
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
                        <span>{article.reading_time || '5 min read'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ArticleGrid({ articles }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
                <ArticleCard key={article.id || article.slug} article={article} />
            ))}
        </div>
    );
}
