import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  title: string;
  ticket_price: number;
  total_tickets: number;
}

interface Ticket {
  id: string;
  buyer_name: string;
  buyer_email: string;
  status: string;
  created_at: string;
}

interface ReferralStats {
  code: string;
  owner_name: string;
  ticket_count: number;
}

export function OrganizerDashboard({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id, title, ticket_price, total_tickets')
          .eq('id', eventId)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);

        const { data: ticketsData, error: ticketsError } = await supabase
          .from('tickets')
          .select('id, buyer_name, buyer_email, status, created_at')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false });

        if (ticketsError) throw ticketsError;
        setTickets(ticketsData || []);

        const { data: refData, error: refError } = await supabase
          .from('referrals')
          .select(`
            code,
            owner_name,
            tickets (count)
          `)
          .eq('event_id', eventId);

        if (refError) throw refError;

        const formattedStats = (refData || []).map((ref: any) => ({
          code: ref.code,
          owner_name: ref.owner_name,
          ticket_count: ref.tickets[0].count
        })).sort((a, b) => b.ticket_count - a.ticket_count);

        setReferralStats(formattedStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [eventId]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Memuat dashboard...</div>;
  }

  if (!event) {
    return <div className="flex justify-center p-8 text-destructive">Event tidak ditemukan.</div>;
  }

  const totalRevenue = tickets.length * event.ticket_price;
  const formattedRevenue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalRevenue);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{event.title}</h2>
        <Button variant="outline" onClick={() => window.open(`/event/${event.id}`, '_blank')}>
          Lihat Halaman Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedRevenue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiket Terjual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
            <p className="text-xs text-muted-foreground">
              dari {event.total_tickets} tiket
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sisa Tiket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.total_tickets - tickets.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard Panitia</CardTitle>
            <CardDescription>Penjualan tiket berdasarkan kode referral.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Panitia</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead className="text-right">Terjual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Belum ada data referral
                    </TableCell>
                  </TableRow>
                ) : (
                  referralStats.map((stat) => (
                    <TableRow key={stat.code}>
                      <TableCell className="font-medium">{stat.owner_name}</TableCell>
                      <TableCell>{stat.code}</TableCell>
                      <TableCell className="text-right">{stat.ticket_count}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pembeli Terbaru</CardTitle>
            <CardDescription>5 transaksi terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Belum ada tiket terjual
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.slice(0, 5).map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.buyer_name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                          {ticket.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
