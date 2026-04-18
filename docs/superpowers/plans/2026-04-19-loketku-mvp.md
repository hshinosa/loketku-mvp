# Loketku MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun Minimum Viable Product (MVP) Loketku yang mencakup pembuatan event, halaman pembelian tiket, *dashboard* panitia (dengan *leaderboard*), dan *scanner* QR code.

**Architecture:** Aplikasi web *full-stack* menggunakan Astro sebagai *framework* utama untuk performa dan SEO, React untuk komponen interaktif (seperti *dashboard* dan form), dan TailwindCSS untuk *styling*. Supabase digunakan sebagai *Backend-as-a-Service* (BaaS) untuk Autentikasi dan Database PostgreSQL.

**Tech Stack:** Astro, React, TailwindCSS, Supabase.

---

### Task 1: Project Scaffolding & Setup

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, dll. (via Astro CLI)
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Inisialisasi Proyek Astro**
Jalankan perintah untuk membuat proyek Astro baru dengan template dasar, lalu tambahkan integrasi React dan TailwindCSS.
```bash
npm create astro@latest . -- --template minimal --install --no-git --yes
npx astro add react tailwind --yes
```

- [ ] **Step 2: Install Dependencies Tambahan**
Install Supabase client dan *library* pendukung lainnya (seperti `lucide-react` untuk icon, `qrcode.react` untuk *generate* QR).
```bash
npm install @supabase/supabase-js lucide-react qrcode.react
```

- [ ] **Step 3: Setup Supabase Client**
Buat file `src/lib/supabase.ts` untuk inisialisasi *client* Supabase.
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

- [ ] **Step 4: Commit Setup Awal**
```bash
git init
git add .
git commit -m "chore: initial astro project setup with react, tailwind, and supabase"
```

---

### Task 2: Database Schema Setup (Supabase)

**Files:**
- Create: `supabase/migrations/20260419000000_initial_schema.sql`

- [ ] **Step 1: Buat Skema Database**
Buat file SQL untuk mendefinisikan tabel `events`, `tickets`, dan `referrals`.
```sql
-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  price DECIMAL NOT NULL,
  quota INTEGER NOT NULL,
  organizer_id UUID NOT NULL -- References auth.users
);

-- Tickets Table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_id UUID REFERENCES events(id) NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_whatsapp TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, scanned
  referral_code TEXT
);

-- Referrals Table (Untuk Leaderboard)
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  panitia_name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL
);
```

- [ ] **Step 2: Commit Skema Database**
```bash
git add supabase/
git commit -m "feat: add initial database schema for events and tickets"
```

---

### Task 3: Halaman Pembuatan Event (Panitia)

**Files:**
- Create: `src/pages/create-event.astro`
- Create: `src/components/CreateEventForm.tsx`

- [ ] **Step 1: Buat Komponen Form React**
Buat `src/components/CreateEventForm.tsx` yang berisi form untuk Nama Event, Tanggal, Lokasi, Harga, dan Kuota. Form ini akan memanggil Supabase untuk menyimpan data.

```tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CreateEventForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [quota, setQuota] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('events')
      .insert([
        { title, date, location, price: parseFloat(price), quota: parseInt(quota), organizer_id: '00000000-0000-0000-0000-000000000000' } // Dummy organizer ID for now
      ]);
    if (error) console.error(error);
    else console.log('Event created:', data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full" required />
      <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 w-full" required />
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 w-full" required />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 w-full" required />
      <input type="number" placeholder="Quota" value={quota} onChange={(e) => setQuota(e.target.value)} className="border p-2 w-full" required />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Create Event</button>
    </form>
  );
}
```

- [ ] **Step 2: Buat Halaman Astro**
Buat `src/pages/create-event.astro` yang me-*render* `<CreateEventForm client:load />`.

```astro
---
import CreateEventForm from '../components/CreateEventForm';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Create Event - Loketku</title>
  </head>
  <body class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-4">Create New Event</h1>
      <CreateEventForm client:load />
    </div>
  </body>
</html>
```

- [ ] **Step 3: Commit Halaman Pembuatan Event**
```bash
git add src/pages/create-event.astro src/components/CreateEventForm.tsx
git commit -m "feat: add event creation page and form"
```

---

### Task 4: Halaman Landing Event & Pembelian Tiket (Pembeli)

**Files:**
- Create: `src/pages/event/[id].astro`
- Create: `src/components/TicketCheckout.tsx`

- [ ] **Step 1: Buat Halaman Dinamis Event**
Buat `src/pages/event/[id].astro` yang mengambil data event dari Supabase berdasarkan ID di URL.

```astro
---
import { supabase } from '../../lib/supabase';
import TicketCheckout from '../../components/TicketCheckout';

const { id } = Astro.params;

const { data: event, error } = await supabase
  .from('events')
  .select('*')
  .eq('id', id)
  .single();

if (error || !event) {
  return Astro.redirect('/404');
}
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{event.title} - Loketku</title>
  </head>
  <body class="bg-gray-100 p-8">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold mb-2">{event.title}</h1>
      <p class="text-gray-600 mb-4">{new Date(event.date).toLocaleString()} | {event.location}</p>
      <p class="mb-6">{event.description}</p>
      
      <div class="border-t pt-6">
        <h2 class="text-xl font-bold mb-4">Buy Ticket (Rp {event.price})</h2>
        <TicketCheckout eventId={event.id} client:load />
      </div>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Buat Komponen Checkout**
Buat `src/components/TicketCheckout.tsx` yang berisi form data pembeli (Nama, Email, WA) dan tombol "Beli Tiket". Untuk MVP, kita akan men-simulasikan pembayaran sukses dan langsung mengubah status tiket menjadi `paid`.

```tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TicketCheckout({ eventId }: { eventId: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment success and create ticket
    const { data, error } = await supabase
      .from('tickets')
      .insert([
        { 
          event_id: eventId, 
          buyer_name: name, 
          buyer_email: email, 
          buyer_whatsapp: whatsapp,
          status: 'paid',
          referral_code: referralCode || null
        }
      ])
      .select();
      
    setLoading(false);
    
    if (error) {
      console.error(error);
      alert('Failed to purchase ticket');
    } else {
      setSuccess(true);
      // In a real app, redirect to the ticket page
      // window.location.href = `/ticket/${data[0].id}`;
    }
  };

  if (success) {
    return <div class="p-4 bg-green-100 text-green-800 rounded">Ticket purchased successfully! Check your email.</div>;
  }

  return (
    <form onSubmit={handleCheckout} className="space-y-4">
      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full" required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" required />
      <input type="tel" placeholder="WhatsApp Number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="border p-2 w-full" required />
      <input type="text" placeholder="Referral Code (Optional)" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className="border p-2 w-full" />
      <button type="submit" disabled={loading} className="bg-green-500 text-white p-2 rounded w-full font-bold">
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Commit Halaman Event**
```bash
git add src/pages/event/[id].astro src/components/TicketCheckout.tsx
git commit -m "feat: add event landing page and checkout flow"
```

---

### Task 5: Dashboard Panitia & Leaderboard

**Files:**
- Create: `src/pages/dashboard/[id].astro`
- Create: `src/components/DashboardStats.tsx`
- Create: `src/components/Leaderboard.tsx`

- [ ] **Step 1: Buat Komponen Statistik & Leaderboard**
Buat komponen React untuk menampilkan total tiket terjual, total pendapatan, dan tabel *leaderboard* berdasarkan `referral_code` dari tabel `tickets`.

```tsx
// src/components/DashboardStats.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function DashboardStats({ eventId }: { eventId: string }) {
  const [stats, setStats] = useState({ ticketsSold: 0, revenue: 0 });

  useEffect(() => {
    async function fetchStats() {
      // Fetch event price
      const { data: event } = await supabase.from('events').select('price').eq('id', eventId).single();
      
      // Fetch paid tickets count
      const { count } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'paid');
        
      if (event && count !== null) {
        setStats({
          ticketsSold: count,
          revenue: count * event.price
        });
      }
    }
    fetchStats();
  }, [eventId]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">Tickets Sold</h3>
        <p className="text-2xl font-bold">{stats.ticketsSold}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">Total Revenue</h3>
        <p className="text-2xl font-bold">Rp {stats.revenue.toLocaleString()}</p>
      </div>
    </div>
  );
}

// src/components/Leaderboard.tsx
export function Leaderboard({ eventId }: { eventId: string }) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      // In a real app, this would be a complex SQL query or RPC call
      // For MVP, we fetch all paid tickets with a referral code and group them in JS
      const { data: tickets } = await supabase
        .from('tickets')
        .select('referral_code')
        .eq('event_id', eventId)
        .eq('status', 'paid')
        .not('referral_code', 'is', null);
        
      if (tickets) {
        const counts = tickets.reduce((acc: any, ticket) => {
          acc[ticket.referral_code] = (acc[ticket.referral_code] || 0) + 1;
          return acc;
        }, {});
        
        const sorted = Object.entries(counts)
          .map(([code, count]) => ({ code, count }))
          .sort((a: any, b: any) => b.count - a.count);
          
        setLeaderboard(sorted);
      }
    }
    fetchLeaderboard();
  }, [eventId]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-4">Referral Leaderboard</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="pb-2">Referral Code</th>
            <th className="pb-2">Tickets Sold</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((item, index) => (
            <tr key={item.code} className="border-b last:border-0">
              <td className="py-2">{item.code}</td>
              <td className="py-2 font-bold">{item.count}</td>
            </tr>
          ))}
          {leaderboard.length === 0 && (
            <tr><td colSpan={2} className="py-4 text-center text-gray-500">No referrals yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Buat Halaman Dashboard**
Buat `src/pages/dashboard/[id].astro` yang menggabungkan komponen-komponen tersebut.

```astro
---
import { supabase } from '../../lib/supabase';
import { DashboardStats, Leaderboard } from '../../components/DashboardStats'; // Assuming both are exported from here for simplicity

const { id } = Astro.params;

const { data: event, error } = await supabase
  .from('events')
  .select('*')
  .eq('id', id)
  .single();

if (error || !event) {
  return Astro.redirect('/404');
}
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Dashboard: {event.title} - Loketku</title>
  </head>
  <body class="bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Dashboard: {event.title}</h1>
      
      <DashboardStats eventId={event.id} client:load />
      <Leaderboard eventId={event.id} client:load />
      
    </div>
  </body>
</html>
```

- [ ] **Step 3: Commit Dashboard**
```bash
git add src/pages/dashboard/[id].astro src/components/DashboardStats.tsx src/components/Leaderboard.tsx
git commit -m "feat: add organizer dashboard with stats and leaderboard"
```

---

### Task 6: Halaman E-Ticket & QR Scanner

**Files:**
- Create: `src/pages/ticket/[id].astro`
- Create: `src/pages/scan.astro`
- Create: `src/components/QRScanner.tsx`

- [ ] **Step 1: Buat Halaman E-Ticket**
Buat `src/pages/ticket/[id].astro` yang menampilkan detail tiket dan QR Code (menggunakan `qrcode.react`) berdasarkan ID tiket.

```astro
---
import { supabase } from '../../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

const { id } = Astro.params;

const { data: ticket, error } = await supabase
  .from('tickets')
  .select('*, events(*)')
  .eq('id', id)
  .single();

if (error || !ticket) {
  return Astro.redirect('/404');
}
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Your Ticket - Loketku</title>
  </head>
  <body class="bg-gray-100 p-8 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center border-t-8 border-blue-500">
      <h1 class="text-2xl font-bold mb-2">{ticket.events.title}</h1>
      <p class="text-gray-600 mb-6">{new Date(ticket.events.date).toLocaleString()}</p>
      
      <div class="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg">
        <QRCodeSVG value={ticket.id} size={200} />
      </div>
      
      <div class="text-left border-t pt-4">
        <p class="text-sm text-gray-500">Name</p>
        <p class="font-bold mb-2">{ticket.buyer_name}</p>
        
        <p class="text-sm text-gray-500">Ticket ID</p>
        <p class="font-mono text-xs">{ticket.id}</p>
        
        <div class="mt-4 inline-block px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
          {ticket.status.toUpperCase()}
        </div>
      </div>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Buat Komponen Scanner**
Buat `src/components/QRScanner.tsx` (bisa menggunakan *library* seperti `html5-qrcode` atau simulasi input manual ID tiket untuk MVP jika akses kamera rumit di awal).

```tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function QRScanner() {
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    // 1. Fetch ticket
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*, events(title)')
      .eq('id', ticketId)
      .single();
      
    if (error || !ticket) {
      setResult({ success: false, message: 'Ticket not found' });
      setLoading(false);
      return;
    }
    
    // 2. Check status
    if (ticket.status === 'scanned') {
      setResult({ success: false, message: 'Ticket already scanned!' });
      setLoading(false);
      return;
    }
    
    if (ticket.status !== 'paid') {
      setResult({ success: false, message: `Ticket status is ${ticket.status}, not paid.` });
      setLoading(false);
      return;
    }
    
    // 3. Update status to scanned
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ status: 'scanned' })
      .eq('id', ticketId);
      
    if (updateError) {
      setResult({ success: false, message: 'Failed to update ticket status' });
    } else {
      setResult({ 
        success: true, 
        message: `Valid Ticket! Checked in ${ticket.buyer_name} for ${ticket.events.title}` 
      });
    }
    
    setLoading(false);
    setTicketId(''); // Clear input for next scan
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Manual Ticket Scanner</h2>
      <p className="text-sm text-gray-500 mb-4">For MVP, enter the Ticket ID manually instead of scanning a QR code.</p>
      
      <form onSubmit={handleScan} className="space-y-4">
        <input 
          type="text" 
          placeholder="Enter Ticket ID (UUID)" 
          value={ticketId} 
          onChange={(e) => setTicketId(e.target.value)} 
          className="border p-2 w-full font-mono text-sm" 
          required 
        />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded w-full font-bold">
          {loading ? 'Checking...' : 'Check In'}
        </button>
      </form>
      
      {result && (
        <div className={`mt-6 p-4 rounded-lg font-bold ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Buat Halaman Scanner**
Buat `src/pages/scan.astro` yang me-*render* komponen scanner.

```astro
---
import QRScanner from '../components/QRScanner';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Scanner - Loketku</title>
  </head>
  <body class="bg-gray-100 p-8">
    <QRScanner client:load />
  </body>
</html>
```

- [ ] **Step 4: Commit E-Ticket & Scanner**
```bash
git add src/pages/ticket/[id].astro src/pages/scan.astro src/components/QRScanner.tsx
git commit -m "feat: add e-ticket view and manual qr scanner page"
```
