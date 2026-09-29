// Removes the first top-level H1 from markdown content.
// Pages render their own H1 (from the article's SEO title) so the stored
// copy — written by the model — is stripped to avoid duplicate H1 tags.
export function stripH1(markdown) {
  if (!markdown) return markdown;
  const lines = markdown.split('\n');
  let i = 0;
  // skip leading blank lines
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length && /^#\s+/.test(lines[i])) {
    lines[i] = '';
  }
  return lines.join('\n');
}
