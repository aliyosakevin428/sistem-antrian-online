import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Counter } from '@/types/counter';
import { QueueCalls } from '@/types/queue_calls';
import { router } from '@inertiajs/react';
import { useState } from 'react';

type Props = {
  counter: Counter | null;
  currentCall: QueueCalls | null;
  waitingCount: number;
};

export default function QueueWidget({ counter, currentCall, waitingCount }: Props) {
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);

  const callNext = () => {
    router.post(route('queue_calls.call_next'), {
      counter_id: counter?.id,
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

  if (!counter) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold">Counter {counter.name}</CardTitle>
      </CardHeader>

      <CardContent className="mt-2 space-y-4 text-center">
        <div>Waiting: {waitingCount}</div>

        {currentCall ? (
          <>
            <div className="text-center text-4xl font-bold">{currentCall.queue.queue_number}</div>

            <div className="text-center text-sm text-muted-foreground">Sudah dipanggil {currentCall.call_number}x</div>

            <div className="flex justify-center gap-4">
              <Button onClick={callNext} variant="secondary" className="w-fit">
                🔁 Panggil Lagi
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-fit">✅ Selesaikan</Button>
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
                    <Button onClick={finish}>Konfirmasi</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
          <Button onClick={callNext} className="w-fit">
            Panggil Berikutnya
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
