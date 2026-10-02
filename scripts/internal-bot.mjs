#!/usr/bin/env node
/**
 * ValorisVisio internal bot tool
 * ------------------------------
 * CLI helper for the internal content bot. NOT for production —
 * run locally against the dev server (npm run dev).
 *
 * Usage (from application/):
 *   node --env-file=.env scripts/internal-bot.mjs article "<topic>"
 *   node --env-file=.env scripts/internal-bot.mjs prices [pages] [delayMs]
 *   node --env-file=.env scripts/internal-bot.mjs status
 *
 * Or via npm:
 *   npm run tool:article -- "<topic>"
 *   npm run tool:prices -- 5 30000
 *   npm run tool:status
 *
 * Env vars (in .env):
 *   BASE_URL          - dev server URL        (default http://localhost:3000)
 *   ADMIN_USERNAME    - admin panel user      (default admin)
 *   ADMIN_PASSWORD    - admin panel password  (default admin123)
 *   JEV_API_KEY       - TypeSafe Jev key; activates the editorial quality layer
 *                       (angle steering, QC gate, semantic dedupe). When unset
 *                       every step degrades to the old behavior.
 *   JEV_MODEL         - optional, default "jev-latest"
 *   JEV_ENDPOINT      - optional, default https://api.typesafe.ai/v1/systemone
 *   NO_JEV=1          - disable all Jev steps for a run
 */

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const USERNAME = process.env.ADMIN_USERNAME || 'admin'
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

function log(msg) {
  console.log(`[internal-bot ${new Date().toISOString()}] ${msg}`)
}

/** Login to the admin panel and return the session cookie value. */
async function login() {
  const res = await fetch(`${BASE_URL}/api/admin/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(`Login failed (${res.status}): ${body.error || 'unknown'}. Check ADMIN_USERNAME/ADMIN_PASSWORD and that the dev server is running.`)
  }
  const setCookie = res.headers.get('set-cookie') || ''
  const match = setCookie.match(/admin_session=([^;]+)/)
  if (!match) throw new Error('Login succeeded but no session cookie returned')
  return match[1]
}

async function api(path, session, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: `admin_session=${session}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`POST ${path} failed (${res.status}): ${data.error || 'unknown'}`)
  return data
}

async function runArticle(topic) {
  if (!topic) {
    console.error('Usage: internal-bot.mjs article "<topic>"')
    process.exit(1)
  }
  log(`Logged in as ${USERNAME}`)
  log(`Generating article on topic: "${topic}" (this can take several minutes: text + image generation)`)
  const t0 = Date.now()
  const noJev = process.env.NO_JEV === '1' || process.env.NO_JEV === 'true'
  const data = await api('/api/blog', await login(), { method: 'POST', body: { topic, noJev } })
  if (data.warnings?.length) {
    for (const w of data.warnings) log(`⚠ ${w}`)
  }
  log(`Done in ${((Date.now() - t0) / 1000).toFixed(0)}s`)
  console.log(JSON.stringify(data, null, 2))
}

async function runPrices(pages = 5, delayMs = 30000) {
  log(`Logged in as ${USERNAME}`)
  const totalDelayMin = ((pages - 1) * delayMs) / 60000
  log(`Updating prices: ${pages} pages × 250 coins, ${delayMs}ms delay between pages (≈${totalDelayMin.toFixed(1)} min total)`)
  const t0 = Date.now()
  const data = await api('/api/admin/prices', await login(), { method: 'POST', body: { pages, delayMs } })
  log(`Done in ${((Date.now() - t0) / 1000).toFixed(0)}s`)
  console.log(JSON.stringify(data, null, 2))
}

async function runStatus() {
  const data = await api('/api/admin/prices', await login())
  console.log(JSON.stringify(data, null, 2))
}

const [cmd, ...args] = process.argv.slice(2)

try {
  if (cmd === 'article') await runArticle(args[0])
  else if (cmd === 'prices') await runPrices(Number(args[0]) || 5, Number(args[1]) || 30000)
  else if (cmd === 'status') await runStatus()
  else {
    console.log('ValorisVisio internal bot tool\n\nCommands:\n  article "<topic>"   generate a blog article (AI text + image)\n  prices [pages] [delayMs]   update crypto prices from CoinGecko (default 5 pages, 30000ms)\n  status                 show last price update statistics\n')
    process.exit(cmd ? 1 : 0)
  }
} catch (err) {
  console.error(`[internal-bot] ERROR: ${err.message}`)
  process.exit(1)
}
