import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, usePage } from '@inertiajs/react';
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

  useEffect(() => {
    if (flash?.success_queue) {
      setQueueNumber(flash.success_queue.queue_number);
      setServiceName(flash.success_queue.service_name);
      setTakenAt(flash.success_queue.taken_at);
      setOpen(true);
    }
  }, [flash]);

  const { data, setData, post, processing } = useForm<{
    service_id: number | null;
  }>({
    service_id: null,
  });


  return (
    <WelcomeLayout>
      <div className="mx-auto mt-16 max-w-md space-y-6">
        <h1 className="text-center text-3xl font-bold">Ambil Nomor Antrian</h1>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            post(route('queue.take'), {
              preserveScroll: true,
            });
          }}
        >
          <Select value={data.service_id ? data.service_id.toString() : ''} onValueChange={(value) => setData('service_id', Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Jenis Pelayanan" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" className="w-full" disabled={processing}>
            Ambil Nomor
          </Button>
        </form>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>Nomor Antrian Anda</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <p className="text-sm text-gray-500">{serviceName}</p>

            <p className="text-6xl font-bold tracking-widest">{queueNumber}</p>

            <p className="text-xs text-gray-400">{takenAt}</p>
          </div>

          <Button onClick={() => setOpen(false)} className="w-full">
            Tutup
          </Button>
        </DialogContent>
      </Dialog>
    </WelcomeLayout>
  );
}
