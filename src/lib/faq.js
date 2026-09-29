// Extracts Q&A pairs from the markdown FAQ section of an article so they can
// be exposed as FAQPage JSON-LD. Tolerant of small format variations:
//   ## FAQ ...            (section start, must mention "faq"/"frequently asked")
//   ### Question?         (each question)
//   answer text           (until next ### or ##)

function stripMd(text) {
  return text
    .replace(/`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractFaq(markdown) {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^#{2,3}\s*.*(\bfaq\b|frequently asked)/i.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start === -1) return [];

  // Section ends at the next H2 (but not the FAQ heading itself)
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i]) && !/^###/.test(lines[i])) {
      end = i;
      break;
    }
  }

  const blocks = [];
  let current = null;
  for (const line of lines.slice(start + 1, end)) {
    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      if (current) blocks.push(current);
      current = { q: stripMd(h3[1]), a: [] };
    } else if (current) {
      current.a.push(line);
    }
  }
  if (current) blocks.push(current);

  return blocks
    .map((b) => ({
      q: b.q,
      a: stripMd(b.a.join(' ')),
    }))
    .filter((b) => b.q.length > 4 && b.a.length > 10)
    .slice(0, 8)
    .map((b) => ({
      '@type': 'Question',
      name: b.q,
      acceptedAnswer: { '@type': 'Answer', text: b.a },
    }));
}
