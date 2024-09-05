import RecentArticles from '@/components/RecentArticles';

export default function Blog() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 mt-[100px]">Recent Articles</h1>
            <RecentArticles />
        </div>
    );
}
