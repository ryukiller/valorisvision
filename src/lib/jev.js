/**
 * Shared TypeSafe Jev (System One) client.
 *
 * Jev makes fast, cheap STRUCTURED judgments (Choice / Score / Noul) against a
 * state; the expensive generative LLM does the actual writing. All combining
 * and thresholding happens in code, never in prompts.
 *
 * Design rules (see trends24 docs/jev-integration.md):
 * - One batched call per stage: all questions about the same state in one request.
 * - Atomic questions; weights/thresholds live in the caller.
 * - Confidence is a second axis: a right-looking answer at low confidence is
 *   treated as unknown → caller falls back to the deterministic signal.
 * - NEVER throws. Every failure (missing key, network, non-200, bad shape)
 *   returns null and callers keep the old behavior. Jev is an enhancement
 *   layer, not a dependency.
 *
 * Env: JEV_API_KEY (required to activate), JEV_MODEL (default "jev-latest"),
 *      JEV_ENDPOINT (default https://api.typesafe.ai/v1/systemone).
 */

const MODEL = () => process.env.JEV_MODEL || 'jev-latest';
const ENDPOINT = () =>
  (process.env.JEV_ENDPOINT || 'https://api.typesafe.ai/v1/systemone').replace(/\/$/, '');

/** Whether Jev is configured at all. */
export function jevAvailable() {
  return Boolean(process.env.JEV_API_KEY);
}

/**
 * Whether the Jev layer is off for this run.
 * `flag` = explicit disable (e.g. request `noJev`); reason logged for ops.
 */
export function jevDisabled(flag, reason) {
  if (flag) {
    console.log(`[jev] off (${reason})`);
    return true;
  }
  if (!jevAvailable()) {
    console.log('[jev] off (set JEV_API_KEY to activate)');
    return true;
  }
  return false;
}

/**
 * One batched call against the System One endpoint.
 *
 * @param {string|object} state     content to judge (string or JSON object)
 * @param {Record<string, {type: 'score'|'choice'|'noul', instructions: string, criteria: unknown}>} questions
 * @returns {Promise<Record<string, object>|null>} answers map (id → { choice?, score?, noul?, confidence?, probabilities? }) or null on any failure.
 */
export async function askJev(state, questions) {
  const apiKey = process.env.JEV_API_KEY || '';
  if (!apiKey) return null;
  try {
    const res = await fetch(ENDPOINT(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ state, model: MODEL(), questions }),
    });
    if (!res.ok) {
      const text = (await res.text().catch(() => '')).slice(0, 160);
      console.warn(`[jev] ${res.status} ${text}`);
      return null;
    }
    const data = await res.json();
    const answers = {};
    for (const [id, a] of Object.entries(data?.answers ?? {})) {
      if (a && typeof a === 'object') answers[id] = a;
    }
    return Object.keys(answers).length > 0 ? answers : null;
  } catch (err) {
    console.warn(`[jev] ${err instanceof Error ? err.message : err}`);
    return null;
  }
}
