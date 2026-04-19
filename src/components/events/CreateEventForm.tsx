import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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
      const { data: event, error } = await supabase
        .from('events')
        .insert([
          {
            title: data.title,
            description: data.description,
            date: data.date,
            location: data.location,
            ticket_price: data.ticket_price,
            total_tickets: data.total_tickets,
            organizer_id: '00000000-0000-0000-0000-000000000000',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const url = `${window.location.origin}/event/${event.id}`;
      setSuccessUrl(url);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Gagal membuat event. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  if (successUrl) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Event Berhasil Dibuat!</CardTitle>
          <CardDescription>Bagikan link ini ke calon pembeli tiket Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-md break-all">
            <a href={successUrl} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              {successUrl}
            </a>
          </div>
          <Button onClick={() => setSuccessUrl(null)} variant="outline" className="w-full">
            Buat Event Lain
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Buat Event Baru</CardTitle>
        <CardDescription>Isi detail event Anda untuk mulai menjual tiket.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Event</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Seminar Nasional Teknologi 2026" {...field} />
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
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Deskripsi singkat tentang event ini" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal & Waktu</FormLabel>
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
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Aula Kampus / Link Zoom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ticket_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Tiket (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1000" {...field} />
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
                    <FormLabel>Total Kuota Tiket</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Buat Event & Generate Link'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
