import { useState, useEffect } from 'react';
import { createTicket, getEventById, getTicketsByEventId } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, MapPinIcon, TicketIcon, CheckCircle2Icon, ArrowRightIcon } from 'lucide-react';

interface ApiEvent {
  id: string;
  organizer_email: string;
  name: string;
  description?: string;
  location?: string;
  event_date: string;
  event_time: string;
  price: number;
  capacity: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface Ticket {
  id: string;
  event_id: string;
  buyer_name: string;
  buyer_email: string;
  quantity: number;
  total_price: number;
  status: string;
  qr_code: string;
  purchased_at: string;
}

export function EventLanding({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [soldTickets, setSoldTickets] = useState(0);
  
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

  useEffect(() => {
    async function fetchEvent() {
      try {
        if (eventId === 'demo') {
          const demoEvent: ApiEvent = {
            id: 'demo',
            organizer_email: 'demo@loketku.com',
            name: 'Demo Event - Loketku',
            description: 'Ini adalah event demo untuk mencoba fitur Loketku. Anda bisa mensimulasikan pembelian tiket.',
            location: 'Demo Location',
            event_date: '2026-12-31',
            event_time: '20:00',
            price: 50000,
            capacity: 100,
            image_url: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setEvent(demoEvent);
          setSoldTickets(48);
          setIsLoading(false);
          return;
        }

        const [apiEvent, tickets] = await Promise.all([
          getEventById(eventId),
          getTicketsByEventId(eventId).catch(() => [])
        ]);

        if (!apiEvent) {
          setEvent(null);
          setSoldTickets(0);
          setIsLoading(false);
          return;
        }

        setEvent(apiEvent);
        setSoldTickets(tickets.reduce((sum, t) => sum + t.quantity, 0));
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  async function handlePurchase(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;

    const remainingTickets = Math.max(event.capacity - soldTickets, 0);
    if (remainingTickets <= 0) {
      alert('Tiket sudah habis terjual.');
      return;
    }
    
    try {
      setIsPurchasing(true);
      const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const ticket = await createTicket({
        id: ticketId,
        event_id: event.id,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        quantity: 1,
        total_price: event.price,
        status: 'valid',
        qr_code: `QR_${ticketId}`,
      });
      setPurchaseSuccess(ticket.id);
      setSoldTickets((current) => current + 1);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert('Gagal membeli tiket. Silakan coba lagi.');
    } finally {
      setIsPurchasing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Memuat detail event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h2 className="text-2xl font-bold">Event Tidak Ditemukan</h2>
        <p className="text-muted-foreground">Event yang Anda cari mungkin telah dihapus atau link tidak valid.</p>
        <Button onClick={() => window.location.href = '/'}>Kembali ke Beranda</Button>
      </div>
    );
  }

  if (purchaseSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4">
        <Card className="border-green-200 shadow-xl shadow-green-100/50 overflow-hidden">
          <div className="bg-green-500 h-2 w-full"></div>
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2Icon className="w-10 h-10" />
            </div>
            <CardTitle className="text-3xl text-green-800 mb-2">Pembelian Berhasil!</CardTitle>
            <CardDescription className="text-lg">Tiket Anda telah diterbitkan dan siap digunakan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6 pb-10 px-8">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4">
              <p className="text-slate-600">Akses e-ticket Anda melalui link di bawah ini. Anda juga bisa menyimpannya untuk ditunjukkan saat acara.</p>
              <Button asChild size="lg" className="w-full text-lg h-14 rounded-xl shadow-md">
                <a href={`/ticket/${purchaseSuccess}`}>
                  Lihat E-Ticket Saya <ArrowRightIcon className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dateTimeStr = `${event.event_date}T${event.event_time}`;
  const formattedDate = new Date(dateTimeStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedPrice = event.price === 0 
    ? 'Gratis' 
    : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(event.price);

  const remainingTickets = Math.max(event.capacity - soldTickets, 0);
  const isSoldOut = remainingTickets <= 0;
  const ticketCopy = isSoldOut ? 'Sold out' : `${remainingTickets} tiket tersisa`;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-24">
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white mb-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2"></span>
              Pendaftaran Dibuka
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <TicketIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">{ticketCopy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {event.description && (
            <section className="prose prose-slate prose-lg max-w-none">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 pb-2 border-b">
                Tentang Event
              </h2>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </div>
            </section>
          )}
        </div>

        <div className="relative">
          <Card className="sticky top-8 shadow-xl border-slate-200 overflow-hidden rounded-2xl">
            <div className="bg-slate-50 border-b border-slate-100 p-6 text-center">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Harga Tiket</p>
              <div className="text-4xl font-extrabold text-slate-900">
                {formattedPrice}
              </div>
            </div>
            
            <CardContent className="p-6">
              <form onSubmit={handlePurchase} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    required 
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="h-12 bg-slate-50"
                    placeholder="Masukkan nama sesuai identitas"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="h-12 bg-slate-50"
                    placeholder="Alamat email aktif"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg mt-6 shadow-md transition-all hover:shadow-lg" 
                  disabled={isPurchasing || isSoldOut}
                >
                  {isSoldOut ? (
                    <span className="flex items-center gap-2">
                      Tiket Habis
                    </span>
                  ) : isPurchasing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <TicketIcon className="w-5 h-5" />
                      Beli Tiket Sekarang
                    </span>
                  )}
                </Button>
                
                <p className="text-xs text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  Pembayaran aman & terverifikasi
                </p>
                <p className="text-xs text-center text-slate-500">
                  {isSoldOut ? 'Kuota tiket untuk event ini sudah habis.' : `${remainingTickets} tiket masih tersedia.`}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
