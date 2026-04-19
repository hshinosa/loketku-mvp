import { useState, useEffect } from 'react';
import { getTicketById, getEventById } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ApiTicket {
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

interface ApiEvent {
  id: string;
  name: string;
  event_date: string;
  event_time: string;
  location: string;
}

interface TicketDetails {
  id: string;
  buyer_name: string;
  buyer_email: string;
  status: string;
  events: {
    title: string;
    date: string;
    location: string;
  };
}

export function ETicket({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const [apiTicket, apiEvent] = await Promise.all([
          getTicketById(ticketId),
          ticketId ? getEventById(ticketId.split('_').slice(0, -1).join('_')).catch(() => null) : Promise.resolve(null)
        ]);

        if (!apiTicket) {
          setTicket(null);
          setIsLoading(false);
          return;
        }

        const event = apiEvent || { name: 'Event', event_date: '', event_time: '', location: 'TBD' };
        const dateTimeStr = `${event.event_date}T${event.event_time}`;

        setTicket({
          id: apiTicket.id,
          buyer_name: apiTicket.buyer_name,
          buyer_email: apiTicket.buyer_email,
          status: apiTicket.status,
          events: {
            title: event.name,
            date: dateTimeStr,
            location: event.location || 'TBD',
          },
        });
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTicket();
  }, [ticketId]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Memuat tiket...</div>;
  }

  if (!ticket) {
    return <div className="flex justify-center p-8 text-destructive">Tiket tidak ditemukan.</div>;
  }

  const isUsed = ticket.status === 'used';

  const formattedDate = new Date(ticket.events.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className="w-full max-w-md mx-auto mt-8 overflow-hidden">
      <div className="bg-primary h-2 w-full"></div>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">{ticket.events.title}</CardTitle>
        <CardDescription>{isUsed ? 'Tiket sudah digunakan' : 'E-Ticket Resmi'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center py-4">
          <div className={`flex h-[220px] w-[220px] items-center justify-center rounded-2xl border bg-white p-4 shadow-sm ${isUsed ? 'opacity-70' : ''}`}>
            <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              <div className="grid grid-cols-6 gap-1.5 rounded-lg bg-white p-3 shadow-sm">
                {Array.from({ length: 36 }).map((_, index) => (
                  <span
                    key={index}
                    className={`block h-3 w-3 rounded-[3px] ${index % 3 === 0 || index % 5 === 0 ? 'bg-slate-900' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
              <p className="mt-4 text-xs font-mono text-slate-500">{ticket.id}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 divide-y">
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">Nama Pemegang Tiket</p>
              <p className="font-semibold text-lg">{ticket.buyer_name}</p>
              <p className="text-sm text-muted-foreground">{ticket.buyer_email}</p>
            </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground">Waktu & Lokasi</p>
            <p className="font-medium">{formattedDate}</p>
            <p className="font-medium">{ticket.events.location}</p>
          </div>

            <div className="pt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${isUsed ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                {ticket.status.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">ID Tiket</p>
                <p className="font-mono text-xs">{ticket.id.split('-')[0]}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t">
          <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full">
            ← Kembali ke Homepage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
