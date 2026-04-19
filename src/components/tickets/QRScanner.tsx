import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getTicketById, markTicketUsed } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function QRScanner({ eventId }: { eventId: string }) {
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

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText: string) {
      scanner.pause();
      setScanResult(decodedText);
      verifyTicket(decodedText);
    }

    function onScanFailure(error: any) {
    }

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

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

  function resetScanner() {
    setScanResult(null);
    setTicketStatus(null);
    window.location.reload();
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Scanner Tiket</CardTitle>
        <CardDescription>Scan QR code pada e-ticket pengunjung untuk check-in.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {!scanResult ? (
          <div id="reader" className="w-full overflow-hidden rounded-lg border"></div>
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
