import { useState } from 'react';
import { getTicketById, markTicketUsed } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function QRScanner({ eventId }: { eventId: string }) {
  const [manualTicketId, setManualTicketId] = useState('');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [ticketStatus, setTicketStatus] = useState<{
    valid: boolean;
    message: string;
    ticket?: {
      id: string;
      buyer_name: string;
    };
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function verifyTicket(ticketId: string) {
    setIsProcessing(true);
    try {
      const ticket = await getTicketById(ticketId);

      if (!ticket || ticket.event_id !== eventId) {
        setTicketStatus({
          valid: false,
          message: 'Tiket tidak ditemukan atau tidak valid untuk event ini.'
        });
        return;
      }

      if (ticket.status === 'used') {
        setTicketStatus({
          valid: false,
          message: 'Tiket sudah digunakan sebelumnya!',
          ticket: {
            id: ticket.id,
            buyer_name: ticket.buyer_name,
          }
        });
        return;
      }

      await markTicketUsed(ticketId);

      setTicketStatus({
        valid: true,
        message: 'Tiket valid! Berhasil check-in.',
        ticket: {
          id: ticket.id,
          buyer_name: ticket.buyer_name,
        }
      });

    } catch (error) {
      console.error('Error verifying ticket:', error);
      setTicketStatus({
        valid: false,
        message: 'Terjadi kesalahan saat memverifikasi tiket.'
      });
    } finally {
      setIsProcessing(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualTicketId.trim()) {
      setScanResult(manualTicketId.trim());
      verifyTicket(manualTicketId.trim());
    }
  }

  function resetScanner() {
    setScanResult(null);
    setTicketStatus(null);
    setManualTicketId('');
  }

  // Demo tickets for interview
  const demoTickets = [
    { id: 'Demo Ticket - John Doe', name: 'John Doe' },
    { id: 'Demo Ticket - Jane Smith', name: 'Jane Smith' },
  ];

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Scanner Tiket</CardTitle>
        <CardDescription>
          Masukkan ID tiket atau scan QR code untuk check-in.
          <br />
          <span className="text-xs text-muted-foreground">
            Untuk demo: gunakan ID tiket dari e-ticket yang sudah dibeli
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!scanResult ? (
          <div className="space-y-4">
            {/* Camera placeholder - not functional in this demo */}
            <div className="w-full aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
              <div className="text-center text-muted-foreground p-4">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm">Kamera tidak tersedia untuk demo ini</p>
                <p className="text-xs mt-1">Gunakan input manual di bawah</p>
              </div>
            </div>

            {/* Manual input for demo */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="ticketId">ID Tiket</Label>
                <Input
                  id="ticketId"
                  value={manualTicketId}
                  onChange={(e) => setManualTicketId(e.target.value)}
                  placeholder="Masukkan ID tiket (contoh: tkt_xxx)"
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={!manualTicketId.trim()}>
                Check-in Tiket
              </Button>
            </form>

            {/* Demo buttons */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Demo Quick Check-in:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setScanResult('demo-ticket-1');
                    setTicketStatus({
                      valid: true,
                      message: 'Tiket valid! Berhasil check-in.',
                      ticket: { id: 'demo-1', buyer_name: 'John Doe (Demo)' }
                    });
                  }}
                  className="text-sm"
                >
                  ✅ Tiket Valid
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setScanResult('demo-ticket-2');
                    setTicketStatus({
                      valid: false,
                      message: 'Tiket sudah digunakan sebelumnya!',
                      ticket: { id: 'demo-2', buyer_name: 'Jane Smith (Demo)' }
                    });
                  }}
                  className="text-sm"
                >
                  ❌ Sudah Dipakai
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isProcessing ? (
              <div className="text-center p-4">Memverifikasi tiket...</div>
            ) : ticketStatus ? (
              <div className={`p-6 rounded-lg text-center ${ticketStatus.valid ? 'bg-green-100' : 'bg-red-100'}`}>
                <h3 className={`text-xl font-bold mb-2 ${ticketStatus.valid ? 'text-green-800' : 'text-red-800'}`}>
                  {ticketStatus.valid ? '✅ BERHASIL' : '❌ GAGAL'}
                </h3>
                <p className="mb-4">{ticketStatus.message}</p>
                
                {ticketStatus.ticket && (
                  <div className="bg-white/50 p-4 rounded text-left mb-4">
                    <p><strong>Nama:</strong> {ticketStatus.ticket.buyer_name}</p>
                    <p><strong>ID:</strong> {ticketStatus.ticket.id.split('-')[0]}</p>
                  </div>
                )}
                
                <Button onClick={resetScanner} className="w-full">
                  Scan Tiket Berikutnya
                </Button>
                <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full mt-2">
                  ← Kembali ke Homepage
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
