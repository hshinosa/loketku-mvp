import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createEvent, createTicket } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon, MapPinIcon, TicketIcon, UsersIcon, CheckCircle2Icon, CopyIcon } from 'lucide-react';

const eventSchema = z.object({
  title: z.string().min(3, 'Judul event minimal 3 karakter'),
  description: z.string().optional(),
  date: z.string().min(1, 'Tanggal event harus diisi'),
  location: z.string().min(1, 'Lokasi event harus diisi'),
  ticket_price: z.coerce.number().min(0, 'Harga tiket tidak boleh negatif'),
  total_tickets: z.coerce.number().min(1, 'Total tiket minimal 1'),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function CreateEventForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      ticket_price: 0,
      total_tickets: 100,
    },
  });

  async function onSubmit(data: EventFormValues) {
    setIsLoading(true);
    try {
      const eventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const event = await createEvent({
        id: eventId,
        organizer_email: 'admin@loketku.com',
        name: data.title,
        description: data.description ?? '',
        location: data.location,
        event_date: data.date.split('T')[0],
        event_time: data.date.split('T')[1] || '00:00',
        price: data.ticket_price,
        capacity: data.total_tickets,
        image_url: '',
      });

      const url = `${window.location.origin}/event/${event.id}`;
      setSuccessUrl(url);

      await createTicket({
        id: `tkt_${Date.now()}_organizer`,
        event_id: event.id,
        buyer_name: 'Loketku Organizer',
        buyer_email: 'organizer@loketku.local',
        quantity: 1,
        total_price: 0,
        status: 'valid',
        qr_code: `QR_${event.id}_organizer`,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Gagal membuat event. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (successUrl) {
      navigator.clipboard.writeText(successUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (successUrl) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8 border-green-200 shadow-lg shadow-green-100/50">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2Icon className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl text-green-800">Event Berhasil Dibuat!</CardTitle>
          <CardDescription className="text-base">Event Anda sekarang live. Bagikan link ini ke calon pembeli tiket Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <a href={successUrl} className="text-primary font-medium truncate hover:underline" target="_blank" rel="noopener noreferrer">
              {successUrl}
            </a>
            <Button variant="secondary" size="sm" onClick={copyToClipboard} className="shrink-0">
              {copied ? <CheckCircle2Icon className="w-4 h-4 mr-2 text-green-600" /> : <CopyIcon className="w-4 h-4 mr-2" />}
              {copied ? 'Tersalin!' : 'Salin Link'}
            </Button>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setSuccessUrl(null)} variant="outline" className="w-full">
              Buat Event Lain
            </Button>
            <Button onClick={() => window.location.href = '/dashboard/1'} className="w-full">
              Ke Dashboard
            </Button>
          </div>
          <div className="pt-2">
            <Button onClick={() => window.location.href = '/'} variant="ghost" className="w-full text-muted-foreground">
              ← Kembali ke Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
        <CardTitle className="text-2xl">Buat Event Baru</CardTitle>
        <CardDescription>Isi detail event Anda untuk mulai menjual tiket dalam hitungan menit.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Judul Event</FormLabel>
                    <FormControl>
                      <Input className="text-lg py-6" placeholder="Contoh: Seminar Nasional Teknologi 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Deskripsi (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Deskripsi singkat tentang event ini" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-100">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-semibold">
                      <CalendarIcon className="w-4 h-4 text-slate-500" />
                      Tanggal & Waktu
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-semibold">
                      <MapPinIcon className="w-4 h-4 text-slate-500" />
                      Lokasi
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Aula Kampus / Link Zoom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-100">
              <FormField
                control={form.control}
                name="ticket_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-semibold">
                      <TicketIcon className="w-4 h-4 text-slate-500" />
                      Harga Tiket (Rp)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                        <Input className="pl-10" type="number" min="0" step="1000" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>Isi 0 untuk event gratis</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_tickets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-semibold">
                      <UsersIcon className="w-4 h-4 text-slate-500" />
                      Total Kuota Tiket
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Buat Event & Generate Link'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
