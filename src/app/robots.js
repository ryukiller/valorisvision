export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://valorisvisio.top/sitemap.xml',
    host: 'https://valorisvisio.top',
  }
}