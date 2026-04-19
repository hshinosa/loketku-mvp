import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  ticket_price: number;
  total_tickets: number;
}

export function EventLanding({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) throw error;
        setEvent(data);
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
    
    setIsPurchasing(true);
    try {
      let referralId = null;
      
      if (referralCode) {
        const { data: refData } = await supabase
          .from('referrals')
          .select('id')
          .eq('code', referralCode)
          .single();
          
        if (refData) {
          referralId = refData.id;
        }
      }

      const { data: ticket, error } = await supabase
        .from('tickets')
        .insert([
          {
            event_id: event.id,
            buyer_name: buyerName,
            buyer_email: buyerEmail,
            status: 'paid',
            referral_id: referralId
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPurchaseSuccess(ticket.id);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert('Gagal membeli tiket. Silakan coba lagi.');
    } finally {
      setIsPurchasing(false);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Memuat detail event...</div>;
  }

  if (!event) {
    return <div className="flex justify-center p-8 text-destructive">Event tidak ditemukan.</div>;
  }

  if (purchaseSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Pembelian Berhasil!</CardTitle>
          <CardDescription>Tiket Anda telah diterbitkan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-md text-center">
            <p className="mb-4">Silakan simpan link tiket Anda:</p>
            <a 
              href={`/ticket/${purchaseSuccess}`} 
              className="text-primary hover:underline font-medium"
            >
              Lihat E-Ticket Saya
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedPrice = event.ticket_price === 0 
    ? 'Gratis' 
    : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(event.ticket_price);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-8">
      <div className="md:col-span-2 space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{event.title}</h1>
          <div className="flex flex-col space-y-2 text-muted-foreground">
            <div className="flex items-center">
              <span className="font-medium mr-2">📅 Tanggal:</span> {formattedDate}
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-2">📍 Lokasi:</span> {event.location}
            </div>
          </div>
        </div>
        
        {event.description && (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-2">Tentang Event</h3>
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        )}
      </div>

      <div>
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Beli Tiket</CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground mt-2">
              {formattedPrice}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePurchase} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  required 
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral">Kode Referral (Opsional)</Label>
                <Input 
                  id="referral" 
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Contoh: PANITIA-BUDI"
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isPurchasing}>
                {isPurchasing ? 'Memproses...' : 'Beli Sekarang'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
