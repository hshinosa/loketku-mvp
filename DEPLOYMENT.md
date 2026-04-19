# Loketku Deployment Guide

## Current Setup (Development)

Loketku sekarang menggunakan **SQLite via `better-sqlite3`** untuk storage persistent.

### Development Mode
```bash
npm run dev
```

Data akan tersimpan di `data/loketku.db` (otomatis dibuat).

## Deployment Options

### Option 1: Vercel with Supabase (Recommended)

Karena Vercel serverless tidak support persistent file storage, untuk production disarankan migrate ke **Supabase (PostgreSQL)**.

#### Steps:
1. Buat project di https://supabase.com
2. Dapatkan `SUPABASE_URL` dan `SUPABASE_KEY`
3. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```
4. Ganti `src/lib/db.ts` dengan Supabase client
5. Update API routes untuk pakai Supabase instead of SQLite
6. Deploy ke Vercel:
   ```bash
   vercel deploy --prod
   ```

### Option 2: VPS/Self-Hosted (SQLite)

Untuk deployment ke VPS (DigitalOcean, Linode, dll):

1. **Build aplikasi:**
   ```bash
   npm run build
   ```

2. **Start server:**
   ```bash
   node dist/server/entry.mjs
   ```

3. **Setup systemd service:**
   ```ini
   [Unit]
   Description=Loketku Astro App
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/loketku
   ExecStart=/usr/bin/node dist/server/entry.mjs
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

4. **Setup nginx reverse proxy** (optional)

5. **Database location:**
   - Default: `/var/www/loketku/data/loketku.db`
   - Bisa diubah via env var `DATABASE_PATH`

### Option 3: Docker

```dockerfile
FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
```

Build & Run:
```bash
docker build -t loketku .
docker run -p 4321:4321 -v loketku-data:/app/data loketku
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_PATH` | Path ke SQLite database | `./data/loketku.db` |
| `PORT` | Port server | `4321` |
| `HOST` | Host binding | `0.0.0.0` |

## Migration Script (SQLite → Supabase)

Ketika siap migrate ke Supabase:

1. Export data dari SQLite:
   ```bash
   sqlite3 data/loketku.db ".dump" > backup.sql
   ```

2. Import ke Supabase Postgres via Dashboard atau CLI

3. Update codebase untuk pakai Supabase client

## Testing Deployment

Setelah deploy, test:
1. Create event baru
2. Buka halaman public event
3. Beli tiket
4. Buka e-ticket
5. Check-in via scanner
6. Refresh browser → data harus persist

## Troubleshooting

### Database locked
```bash
rm data/loketku.db-shm data/loketku.db-wal
```

### API 404 errors
- Pastikan API routes ada `export const prerender = false;`
- Check Node adapter mode: `standalone`

### Build fails
```bash
rm -rf node_modules .astro dist
npm install
npm run build
```
