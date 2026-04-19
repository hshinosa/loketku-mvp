import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';

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
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            id,
            buyer_name,
            buyer_email,
            status,
            events (
              title,
              date,
              location
            )
          `)
          .eq('id', ticketId)
          .single();

        if (error) throw error;
        setTicket(data as unknown as TicketDetails);
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
        <CardDescription>E-Ticket Resmi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center py-4">
          <div className="p-4 bg-white rounded-xl shadow-sm border">
            <QRCodeSVG 
              value={ticket.id} 
              size={200}
              level="H"
              includeMargin={true}
            />
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
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                {ticket.status.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">ID Tiket</p>
              <p className="font-mono text-xs">{ticket.id.split('-')[0]}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
