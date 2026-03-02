import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Counter } from '@/types/counter';
import { QueueCalls } from '@/types/queue_calls';
import { router } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

type Props = {
  counter: Counter | null;
  currentCall: QueueCalls | null;
  waitingCount: number;
};

export default function QueueWidget({ counter, currentCall, waitingCount }: Props) {
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);

  if (!counter) return null;

  const callNext = () => {
    if (!counter.is_active) return;

    router.post(route('queue_calls.call_next'), {
      counter_id: counter.id,
    });
  };

  const finish = () => {
    if (!currentCall) return;

    router.put(
      route('queue_calls.finish', currentCall.id),
      { notes },
      {
        preserveScroll: true,
        onSuccess: () => {
          setNotes('');
          setOpen(false);
        },
      },
    );
  };

  return (
    <Card className="rounded-2xl border bg-background shadow-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">Counter {counter.name}</CardTitle>

        {!counter.is_active && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Counter sedang dalam status break
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6 text-center">
        {/* Waiting Info */}
        <div className="rounded-xl bg-muted/40 px-4 py-3">
          <p className="text-sm text-muted-foreground">Antrian Menunggu</p>
          <p className="text-3xl font-bold">{waitingCount}</p>
        </div>

        {currentCall ? (
          <>
            {/* Current Queue */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Sedang Dilayani</p>
              <p className="text-5xl font-extrabold tracking-wide">{currentCall.queue.queue_number}</p>
              <p className="text-xs text-muted-foreground">Sudah dipanggil {currentCall.call_number}x</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button onClick={callNext} variant="secondary" disabled={!counter.is_active}>
                🔁 Panggil Lagi
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!counter.is_active}>✅ Selesaikan</Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Selesaikan Antrian</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <p>
                      Nomor antrian: <span className="font-bold">{currentCall.queue.queue_number}</span>
                    </p>

                    <Textarea placeholder="Tambahkan catatan (opsional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>

                  <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={finish} disabled={!counter.is_active}>
                      Konfirmasi
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
          <Button onClick={callNext} disabled={!counter.is_active} className="px-6 py-6 text-lg font-semibold">
            Panggil Berikutnya
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
