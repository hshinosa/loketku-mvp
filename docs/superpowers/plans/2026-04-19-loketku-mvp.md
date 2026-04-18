# Loketku MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun Minimum Viable Product (MVP) Loketku yang mencakup pembuatan event, halaman pembelian tiket, *dashboard* panitia (dengan *leaderboard*), dan *scanner* QR code.

**Architecture:** Aplikasi web *full-stack* menggunakan Astro sebagai *framework* utama untuk performa dan SEO, React untuk komponen interaktif (seperti *dashboard* dan form), dan TailwindCSS + shadcn/ui untuk *styling* dan komponen UI. Supabase digunakan sebagai *Backend-as-a-Service* (BaaS) untuk Autentikasi dan Database PostgreSQL.

**Tech Stack:** Astro, React, TailwindCSS, shadcn/ui, Supabase.

---

### Task 1: Project Scaffolding & Setup

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `components.json`, dll.
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Inisialisasi Proyek Astro**
Jalankan perintah untuk membuat proyek Astro baru dengan template dasar, lalu tambahkan integrasi React dan TailwindCSS.
```bash
npm create astro@latest . -- --template minimal --install --no-git --yes
npx astro add react tailwind --yes
```

- [ ] **Step 2: Install Dependencies Tambahan & Inisialisasi shadcn/ui**
Install Supabase client, library pendukung, dan inisialisasi shadcn/ui.
```bash
npm install @supabase/supabase-js lucide-react qrcode.react
npx shadcn@latest init -d
```

- [ ] **Step 3: Install Komponen Dasar shadcn/ui**
Install komponen-komponen UI yang akan sering digunakan.
```bash
npx shadcn@latest add button input card label table
```

- [ ] **Step 4: Setup Supabase Client**
Buat file `src/lib/supabase.ts` untuk inisialisasi *client* Supabase.
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

- [ ] **Step 5: Commit Setup Awal**
```bash
git add .
git commit -m "chore: initial astro project setup with react, tailwind, shadcn/ui, and supabase"
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
Buat `src/components/CreateEventForm.tsx` yang berisi form untuk Nama Event, Tanggal, Lokasi, Harga, dan Kuota. Form ini akan memanggil Supabase untuk menyimpan data dan menggunakan komponen shadcn/ui.

```tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateEventForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [quota, setQuota] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .insert([
        { title, date, location, price: parseFloat(price), quota: parseInt(quota), organizer_id: '00000000-0000-0000-0000-000000000000' } // Dummy organizer ID for now
      ]);
    setLoading(false);
    if (error) console.error(error);
    else {
      console.log('Event created:', data);
      alert('Event created successfully!');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>Fill in the details to publish your event.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" placeholder="e.g., Seminar Nasional Tech 2026" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Auditorium Kampus" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (Rp)</Label>
              <Input id="price" type="number" placeholder="50000" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quota">Quota</Label>
              <Input id="quota" type="number" placeholder="100" value={quota} onChange={(e) => setQuota(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Buat Halaman Astro**
Buat `src/pages/create-event.astro` yang me-*render* `<CreateEventForm client:load />`.

```astro
---
import CreateEventForm from '../components/CreateEventForm';
import '../styles/globals.css'; // Ensure shadcn styles are loaded
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Create Event - Loketku</title>
  </head>
  <body class="bg-slate-50 min-h-screen p-8 flex items-center justify-center">
    <CreateEventForm client:load />
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
import { Calendar, MapPin } from 'lucide-react';
import '../styles/globals.css';

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
  <body class="bg-slate-50 min-h-screen p-4 md:p-8">
    <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border overflow-hidden">
      <div class="h-48 bg-slate-200 w-full"></div> <!-- Placeholder for event banner -->
      <div class="p-6 md:p-8">
        <h1 class="text-3xl font-bold tracking-tight mb-4">{event.title}</h1>
        
        <div class="flex flex-col sm:flex-row gap-4 mb-8 text-slate-600">
          <div class="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{new Date(event.date).toLocaleString()}</span>
          </div>
          <div class="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{event.location}</span>
          </div>
        </div>
        
        <div class="prose max-w-none mb-8">
          <p>{event.description || 'No description provided.'}</p>
        </div>
        
        <div class="border-t pt-8 mt-8">
          <h2 class="text-2xl font-bold mb-6">Get Your Tickets</h2>
          <TicketCheckout eventId={event.id} price={event.price} client:load />
        </div>
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function TicketCheckout({ eventId, price }: { eventId: string, price: number }) {
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
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <div className="text-green-600 font-semibold mb-2">Ticket purchased successfully!</div>
          <p className="text-sm text-green-700">We've sent the e-ticket to your email and WhatsApp.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleCheckout} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          <Input id="whatsapp" type="tel" placeholder="081234567890" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="referral">Referral Code (Optional)</Label>
        <Input id="referral" placeholder="e.g., PANITIA-BUDI" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
      </div>
      
      <div className="pt-4 flex items-center justify-between border-t mt-6">
        <div>
          <p className="text-sm text-slate-500">Total Payment</p>
          <p className="text-2xl font-bold">Rp {price.toLocaleString()}</p>
        </div>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Ticket, DollarSign, Trophy } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
          <Ticket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ticketsSold}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {stats.revenue.toLocaleString()}</div>
        </CardContent>
      </Card>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Referral Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead className="text-right">Tickets Sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((item, index) => (
              <TableRow key={item.code}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell className="text-right font-bold">{item.count}</TableCell>
              </TableRow>
            ))}
            {leaderboard.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No referrals yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Buat Halaman Dashboard**
Buat `src/pages/dashboard/[id].astro` yang menggabungkan komponen-komponen tersebut.

```astro
---
import { supabase } from '../../lib/supabase';
import { DashboardStats, Leaderboard } from '../../components/DashboardStats'; // Assuming both are exported from here for simplicity
import '../styles/globals.css';

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
  <body class="bg-slate-50 min-h-screen p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p class="text-slate-500">{event.title}</p>
        </div>
      </div>
      
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
import '../styles/globals.css';

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
  <body class="bg-slate-50 p-4 md:p-8 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-xl shadow-sm border max-w-sm w-full text-center relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-2 bg-primary"></div>
      
      <h1 class="text-2xl font-bold tracking-tight mb-2 mt-2">{ticket.events.title}</h1>
      <p class="text-muted-foreground mb-8">{new Date(ticket.events.date).toLocaleString()}</p>
      
      <div class="flex justify-center mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <QRCodeSVG value={ticket.id} size={200} />
      </div>
      
      <div class="text-left border-t pt-6 border-dashed">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Name</p>
            <p class="font-medium">{ticket.buyer_name}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Status</p>
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              {ticket.status.toUpperCase()}
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <p class="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Ticket ID</p>
          <p class="font-mono text-xs text-slate-600">{ticket.id}</p>
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, CheckCircle2, XCircle } from 'lucide-react';

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
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanLine className="h-5 w-5" />
          Manual Ticket Scanner
        </CardTitle>
        <CardDescription>
          For MVP, enter the Ticket ID manually instead of scanning a QR code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleScan} className="space-y-4">
          <Input 
            type="text" 
            placeholder="Enter Ticket ID (UUID)" 
            value={ticketId} 
            onChange={(e) => setTicketId(e.target.value)} 
            className="font-mono text-sm" 
            required 
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Checking...' : 'Check In'}
          </Button>
        </form>
        
        {result && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${result.success ? 'bg-green-50 text-green-900 border border-green-200' : 'bg-red-50 text-red-900 border border-red-200'}`}>
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div className="font-medium">{result.message}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Buat Halaman Scanner**
Buat `src/pages/scan.astro` yang me-*render* komponen scanner.

```astro
---
import QRScanner from '../components/QRScanner';
import '../styles/globals.css';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Scanner - Loketku</title>
  </head>
  <body class="bg-slate-50 min-h-screen p-4 md:p-8 flex items-center justify-center">
    <div class="w-full">
      <QRScanner client:load />
    </div>
  </body>
</html>
```

- [ ] **Step 4: Commit E-Ticket & Scanner**
```bash
git add src/pages/ticket/[id].astro src/pages/scan.astro src/components/QRScanner.tsx
git commit -m "feat: add e-ticket view and manual qr scanner page"
```
