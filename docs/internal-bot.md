# ValorisVisio — Internal Content Bot

Guida per il bot interno che genera periodicamente articoli crypto e aggiorna i prezzi.

Questo tool è **uso interno solo**: gira sul PC locale, NON in produzione.
Tutti i comandi richiedono che il dev server sia in esecuzione.

## Prerequisiti

1. Server di sviluppo in esecuzione: `npm run dev` (porta 3000)
2. MongoDB raggiungibile (variabile `MONGODB` nel `.env`)
3. `OPENAI_API_KEY` valida nel `.env`
4. Credenziali admin nel `.env`: `ADMIN_USERNAME` / `ADMIN_PASSWORD`
   (default: `admin` / `admin123`)

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
   - immagine header 1536×1024 (modello `gpt-image-2.5-flare`), salvata in `public/imgs/`
4. Salva l'articolo in MongoDB (collection `blog`, pubblicato) e aggiorna `public/sitemap.xml`

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

## Note importanti

- **Autenticazione**: `POST /api/blog`, `POST/GET /api/admin/prices` richiedono
  il cookie `admin_session` (24h di validità). Senza cookie → `401 Unauthorized`.
  Il tool CLI gestisce il login automaticamente.
- **Modelli OpenAI**: configurabili via `.env`:
  - `OPENAI_TEXT_MODEL` (default `gpt-6-luna`) — generazione testo
  - `OPENAI_IMAGE_MODEL` (default `gpt-image-2.5-flare`) — immagine header
- **Immagini**: vengono scritte in `public/imgs/<slug>-<timestamp>.png`.
  In un deploy VCS-based (es. Vercel) i file nuovi non sono persistenti:
  il bot interno è pensato per girare dove `public/` è scrivibile (dev locale).
- **Sitemap**: viene aggiornato sul file locale `public/sitemap.xml`.
- **Errori**: in caso di errore il tool esce con codice 1 e stampa
  `ERROR: <motivo>` sull'stderr. Errori comuni:
  - `Login failed` → credenziali errate o dev server non avviato
  - `429` da CoinGecko → aumenta `delayMs`
  - errori OpenAI → controlla `OPENAI_API_KEY` e crediti

## Piano di lavoro tipico (es. giornaliero)

```bash
npm run dev &                                # se non già avviato
npm run tool:article -- "<tema del giorno>" # 2-5 min
npm run tool:prices                          # ~2 min
npm run tool:status                          # verifica
```
