# ValorisVisio — Internal Content Bot

Guida per il bot interno che genera periodicamente articoli crypto e aggiorna i prezzi.

Questo tool è **uso interno solo**: gira sul PC locale, NON in produzione.
Tutti i comandi richiedono che il dev server sia in esecuzione.

## Prerequisiti

1. Server di sviluppo in esecuzione: `npm run dev` (porta 3000)
2. MongoDB raggiungibile (variabile `MONGODB` nel `.env`)
3. `OPENAI_API_KEY` valida nel `.env`
4. Credenziali admin nel `.env`: `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH`

Tutto il tool legge le variabili dal file `application/.env`.

## Comandi

Tutti da eseguire nella cartella `application/`.

### Genera un articolo (testo AI + immagine AI)

```bash
npm run tool:article -- "<tema dell'articolo>"
```

Esempio:

```bash
npm run tool:article -- "Bitcoin ETF outflows analysis"
```

Cosa fa:
1. Login al pannello admin (`POST /api/admin/auth`)
2. Chiamata a `POST /api/blog` con `{ "topic": "<tema>" }`
3. Il backend genera con l'OpenAI **Responses API**:
   - articolo ≥1500 parole in markdown, ottimizzato SEO, con FAQ, internal link
   - titolo, slug, categorie, keyword, meta description
   - immagine header 1536×1024 (modello `gpt-image-2.5-flare`), salvata in MongoDB (collection `blog_images`) e servita da `/api/article-image/<nome>`
4. Salva l'articolo in MongoDB (collection `blog`, pubblicato). Il sitemap è dinamico (`src/app/sitemap.js`) e si aggiorna da solo

### Layer editoriale Jev (TypeSafe System One, opzionale)

Se `JEV_API_KEY` è impostata nel `.env`, la pipeline di `POST /api/blog`
guadagna tre giudizi strutturati economici (Jev è una "enhancement layer":
senza key o su errore ogni step degrada silenziosamente al comportamento
precedente, il bot non rompe mai):

1. **Angle steering** — un Choice Jev sceglie l'angolo editoriale migliore per
   il tema (news-breakdown / market-impact / explainer / contrarian-take /
   investor-action) e lo inietta nel prompt del writer come
   `EDITORIAL DIRECTION`. Il writer LLM decide comunque tutto.
2. **QC gate** — dopo la bozza, una chiamata con 4 domande: titolo coerente
   (Choice, clickbait), dati non giustificati (Noul), categoria corretta
   (Choice, auto-correzione se confidenza ≥ 0.5), forza excerpt (Score).
   Se clickbait (conf ≥ 0.5) o dati non giustificati (≥ 0.6) → **1 retry** del
   writer con correzione esplicita. Ancora flaggato → l'articolo viene
   pubblicato ma la risposta contiene `warnings: [...]` (il tool CLI le
   stampa come `⚠ ...`).
3. **Semantic dedupe** — uno Noul per coppia contro i 20 articoli più recenti
   dell'archivio: se `noul ≥ 0.6` → warning "may duplicate existing post"
   (soft: mai blocca la pubblicazione, serve a non coprire la stessa storia).

Disattiva tutto per una singola run: `NO_JEV=1 npm run tool:article -- "..."`
oppure il body `{ "noJev": true }` sull'endpoint. I log del dev server
usano il prefisso `[jev]` per auditare le decisioni (angle, QC, dedupe).

Tuning (in ordine di leverage): wording dei livelli Score → soglie
(clickbait 0.5 / dati 0.6 / dedupe 0.6, in `src/app/api/blog/route.js`) →
menu angle. Monitora i log per una settimana prima di fidarti delle soglie.

**Durata attesa: 2-5 minuti** per articolo. Non timeoutare prima.

Output: JSON con `success`, `id` e `article` (`title`, `slug`, `image_url`).
L'articolo sarà visibile a `https://<dominio>/blog/<slug>`.

### Aggiorna i prezzi crypto

```bash
npm run tool:prices                    # default: 5 pagine (1250 coin)
npm run tool:prices -- 10 30000        # 10 pagine, delay 30s tra le pagine
```

Cosa fa: download da CoinGecko (250 coin/pagina, order market_cap) e upsert in MongoDB
(collection `coins`), poi pulisce la cache locale.

**Durata attesa:** `(pagine - 1) × delay` — con i default ≈ 2 minuti.
Il delay tra le pagine serve a rispettare il rate limit CoinGecko (free tier):
**non ridurlo sotto 15000ms**, altrimenti le pagine successive falliranno con 429.

### Stato ultimo aggiornamento prezzi

```bash
npm run tool:status
```

Ritorna statistiche (totale coin, ultimo update, market cap medio) e gli ultimi
10 coin aggiornati con prezzo.

## Comandi raw (equivalenti curl, se il bot vuole chiamare gli endpoint direttamente)

```bash
# 1. Login e salvataggio del cookie di sessione
TOKEN=$(curl -s -X POST http://localhost:3000/api/admin/auth \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"<ADMIN_PASSWORD>"}' \
  -D - -o /dev/null | grep -i set-cookie | grep -o 'admin_session=[^;]*' | cut -d= -f2)

# 2. Nuovo articolo
curl -X POST http://localhost:3000/api/blog \
  -H 'Content-Type: application/json' -H "Cookie: admin_session=$TOKEN" \
  -d '{"topic":"<tema>"}'

# 3. Aggiornamento prezzi
curl -X POST http://localhost:3000/api/admin/prices \
  -H 'Content-Type: application/json' -H "Cookie: admin_session=$TOKEN" \
  -d '{"pages":5,"delayMs":30000}'
```

## Problemi noti e fix

### CoinGecko 403 sui prezzi
L'endpoint `/coins/markets` restituisce **403** senza API key. Fix: imposta nel `.env`
`COINGECKO_API_KEY` (key demo gratis da https://www.coingecko.com/en/api) e **riavvia**
il dev server (le variabili d'ambiente vengono lette all'avvio).

In caso di 429 (rate limit) il tool fa 3 retry per pagina con backoff crescente
(delayMs × tentativo). Se la prima pagina fallisce definitivamente il tool aborte
con `502` e il motivo preciso, senza sprecare le altre pagine.

### MongoDB: DNS SRV fallisce al primo avvio
Se `MONGODB` usa `mongodb+srv://` e il lookup DNS-SRV fallisce al primo avvio
del dev server, usa una URI piana invece, es.:

```
MONGODB=mongodb://user:pass@host1:27017,host2:27017/?replicaSet=RS0&authSource=admin
```

(oppure più semplicemente: riavvia il dev server una volta — spesso al secondo
tentativo il DNS risponde). Il workaround va applicato nel `.env` prima del riavvio.

## Note importanti

- **Autenticazione**: `POST /api/blog`, `POST/GET /api/admin/prices` richiedono
  il cookie `admin_session` (24h di validità). Senza cookie → `401 Unauthorized`.
  Il tool CLI gestisce il login automaticamente.
- **Modelli OpenAI**: configurabili via `.env`:
  - `OPENAI_TEXT_MODEL` (default `gpt-6-luna`) — generazione testo
  - `OPENAI_IMAGE_MODEL` (default `gpt-image-2.5-flare`) — immagine header
- **Jev (TypeSafe)**: `JEV_API_KEY` (opzionale — attiva il layer qualità,
  vedi sezione sopra), `JEV_MODEL` (default `jev-latest`),
  `JEV_ENDPOINT` (default `https://api.typesafe.ai/v1/systemone`),
  `NO_JEV=1` per disattivare. Costo/latenza: ~3-4 chiamate Jev per
  articolo (qualche centesimo, pochi secondi), a protezione di 1-2
  generazioni LLM complete che costano 10-30× di più.
- **Immagini**: vengono salvate in MongoDB (collection `blog_images`, key
  `<slug>-<timestamp>.webp`) e servite da `/api/article-image/<nome>` con
  `Cache-Control` annuale: funziona sia in dev che in produzione, senza
  dipendere dalla persistenza di `public/`. Le immagini storiche
  già committed sotto `public/imgs/` continuano a essere servite come
  asset statici.
- **Cover image empty (Content-Length: 0)**: if `/api/article-image/<name>`
  returns `200` with `Content-Type: image/webp` but zero bytes, the serve
  path used to call `new Uint8Array(mongoBinary)` — BSON `Binary.length` is
  a method, so that builds an empty typed array. Fixed in
  `src/lib/article-images.js` (`coerceImageBytes`). After deploy:
  1. Verify with
     `curl -sI "https://valorisvisio.top/api/article-image/<name>"`
     — `Content-Length` must be `> 0`.
  2. **Purge CDN/edge cache** for those URLs (responses were cached for a
     year as `immutable`). Vercel + Cloudflare both need a purge, or the
     browser/CDN will keep serving the empty body.
  3. Bytes in `blog_images` were almost certainly fine — no re-generation
     needed once cache is purged. If a key still 404s or stays empty after
     purge, re-run
     `npm run tool:article -- "<topic>"` (creates a **new** key) and update
     the article's `imageUrl`, or locally re-save the same key via
     `saveArticleImage(key, webpBuffer)` against the **production**
     `MONGODB` URI the Vercel app uses.
- **Sitemap**: è dinamico (`src/app/sitemap.js`), nessun file da aggiornare.
- **Errori**: in caso di errore il tool esce con codice 1 e stampa
  `ERROR: <motivo>` sull'stderr. Errori comuni:
  - `Login failed` → credenziali errate o dev server non avviato
  - `Aborting: CoinGecko rejected the first page (HTTP 403...)` → imposta `COINGECKO_API_KEY` nel `.env` e riavvia il dev server
  - `HTTP 429` da CoinGecko → aumenta `delayMs`
  - errori OpenAI → controlla `OPENAI_API_KEY` e crediti
  - errori MongoDB DNS/SRV → vedi sezione "Problemi noti e fix"

## Piano di lavoro tipico (es. giornaliero)

```bash
npm run dev &                                # se non già avviato
npm run tool:article -- "<tema del giorno>" # 2-5 min
npm run tool:prices                          # ~2 min
npm run tool:status                          # verifica
```
