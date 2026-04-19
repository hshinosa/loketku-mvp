import { useState, useEffect } from 'react';
import { getDashboardSnapshot } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketIcon, UsersIcon, BanknoteIcon, TrendingUpIcon, ClockIcon } from 'lucide-react';

export function OrganizerDashboard({ eventId }: { eventId: string }) {
  const [snapshot, setSnapshot] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSnapshot() {
      try {
        const data = await getDashboardSnapshot(eventId);
        setSnapshot(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSnapshot();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Memuat dashboard...</p>
      </div>
    );
  }

  if (!snapshot || !snapshot.event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h2 className="text-2xl font-bold">Event Tidak Ditemukan</h2>
        <p className="text-muted-foreground">Data event tidak dapat dimuat.</p>
      </div>
    );
  }

  const event = snapshot.event;
  const formattedRevenue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(snapshot.totalRevenue);
  const remainingTickets = snapshot.remainingTickets;
  const checkedInTickets = snapshot.checkInStats.used;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{event.title}</h2>
        <p className="text-slate-500">Dashboard Organizer</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="bg-blue-500 h-1 w-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Pendapatan</CardTitle>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BanknoteIcon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{formattedRevenue}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="bg-green-500 h-1 w-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tiket Terjual</CardTitle>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <TrendingUpIcon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{tickets.length}</div>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              dari {event.total_tickets} tiket
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="bg-amber-500 h-1 w-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Sisa Tiket</CardTitle>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <TicketIcon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{remainingTickets}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-2xl pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <UsersIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Ringkasan Check-in</CardTitle>
                <CardDescription>Status kehadiran peserta pada event ini.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="pl-6">Status</TableHead>
                  <TableHead className="text-right pr-6">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="pl-6 font-medium">Check-in sukses</TableCell>
                  <TableCell className="text-right pr-6 font-bold text-slate-700">{checkedInTickets}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6 font-medium">Belum check-in</TableCell>
                  <TableCell className="text-right pr-6 font-bold text-slate-700">{tickets.length - checkedInTickets}</TableCell>
                </TableRow>
                {tickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="h-32 text-center text-slate-500">
                      Belum ada tiket terjual
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-2xl pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Daftar Pembeli Terbaru</CardTitle>
                <CardDescription>5 transaksi terakhir.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="pl-6">Nama</TableHead>
                  <TableHead className="text-right pr-6">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshot.recentPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-32 text-center text-slate-500">
                      Belum ada tiket terjual
                    </TableCell>
                  </TableRow>
                ) : (
                  snapshot.recentPurchases.map((purchase: any) => (
                    <TableRow key={purchase.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6 font-medium text-slate-700">{purchase.buyer_name}</TableCell>
                      <TableCell className="text-right pr-6 text-sm text-slate-500">
                        {new Date(purchase.purchased_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
