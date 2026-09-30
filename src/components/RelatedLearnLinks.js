import Link from 'next/link';
import { getLearnLinksForBlogSlug } from '@/lib/seo/blog-to-learn-map';

/**
 * Further-reading panel driven by src/lib/seo/blog-to-learn-map.js.
 * Renders nothing when the slug has no mapped Learn URLs.
 *
 * @param {{ slug: string }} props
 */
export default function RelatedLearnLinks({ slug }) {
  const links = getLearnLinksForBlogSlug(slug);
  if (!links.length) return null;

  return (
    <aside
      className="mt-12 border border-neon-cyan/40 bg-panel/50 p-6 cyber-cut-sm"
      aria-labelledby="further-reading-learn"
    >
      <p className="term-label mb-2">{'// further_reading'}</p>
      <h2
        id="further-reading-learn"
        className="font-display text-xl font-bold tracking-tight text-foreground mb-2"
      >
        Evergreen Learn guides
      </h2>
      <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
        Go deeper with durable explainers on ValorisVisio Learn — separate from this news post.
      </p>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block border border-line px-4 py-3 cyber-cut-sm hover:border-neon-cyan/70 transition-colors"
            >
              <p className="text-neon-cyan font-medium">{link.title}</p>
              {link.description ? (
                <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
