import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import WelcomeLayout from './layouts/welcome-layout';

type PageProps = {
  services: {
    id: number;
    name: string;
  }[];
  flash: {
    success_queue?: {
      queue_number: string;
      service_name: string;
      taken_at: string;
    };
  };
};

export default function TakeQueue() {
  const { services = [], flash } = usePage<PageProps>().props;

  const [open, setOpen] = useState(false);
  const [queueNumber, setQueueNumber] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState<string | null>(null);
  const [takenAt, setTakenAt] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (flash?.success_queue) {
      setQueueNumber(flash.success_queue.queue_number);
      setServiceName(flash.success_queue.service_name);
      setTakenAt(flash.success_queue.taken_at);
      setOpen(true);
      setProcessing(false);
    }
  }, [flash]);

  const handleTakeQueue = (serviceId: number) => {
    setProcessing(true);

    router.post(
      route('queue.take'),
      {
        service_id: serviceId,
      },
      {
        preserveScroll: true,
      },
    );
  };

  return (
    <WelcomeLayout>
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-wide">Ambil Nomor Antrian</h1>

          <p className="mt-4 text-lg text-gray-400">Silakan pilih layanan yang Anda butuhkan</p>

          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-green-500" />
        </div>

        <div className="grid w-full max-w-5xl gap-10 md:grid-cols-2">
          {services.map((service) => (
            <Button
              key={service.id}
              disabled={processing}
              onClick={() => handleTakeQueue(service.id)}
              className="h-36 rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-400 text-2xl font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:border-green-500 hover:text-green-400"
            >
              {service.name}
            </Button>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md rounded-3xl border border-gray-800 bg-gray-950 p-10 text-center text-white">
            <DialogHeader>
              <DialogTitle className="text-lg tracking-wide text-gray-400">Nomor Antrian Anda</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-8">
              <p className="text-sm tracking-widest text-green-400 uppercase">{serviceName}</p>

              <p className="text-8xl font-extrabold tracking-widest">{queueNumber}</p>

              <p className="text-xs text-gray-500">{takenAt}</p>
            </div>

            <Button onClick={() => setOpen(false)} className="h-12 w-full rounded-xl bg-green-600 text-lg hover:bg-green-700">
              Selesai
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </WelcomeLayout>
  );
}
