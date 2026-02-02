import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router, usePage } from '@inertiajs/react';
import { Maximize, Minimize } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const displayRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 
  useEffect(() => {
    if (flash?.success_queue) {
      setQueueNumber(flash.success_queue.queue_number);
      setServiceName(flash.success_queue.service_name);
      setTakenAt(flash.success_queue.taken_at);
      setOpen(true);
      setProcessing(false);
    }
  }, [flash]);


  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await displayRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  useEffect(() => {
    const handleMove = () => {
      setShowButton(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setShowButton(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMove);

    timeoutRef.current = setTimeout(() => {
      setShowButton(false);
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleTakeQueue = (serviceId: number) => {
    setProcessing(true);

    router.post(route('queue.take'), { service_id: serviceId }, { preserveScroll: true });
  };

  return (
    <WelcomeLayout>
      <div
        ref={displayRef}
        className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-6 text-white"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullScreen}
          className={`absolute top-6 right-6 z-50 text-white transition-opacity duration-300 ${showButton ? 'opacity-100' : 'opacity-0'}`}
        >
          {isFullScreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
        </Button>

        <div className="mb-14 text-center">
          <h1 className={`font-extrabold tracking-wide transition-all duration-300 ${isFullScreen ? 'text-6xl' : 'text-5xl'}`}>
            Ambil Nomor Antrian
          </h1>

          <p className="mt-4 text-lg text-gray-400">Silakan pilih layanan yang Anda butuhkan</p>

          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-green-500" />
        </div>

        <div className={`grid w-full max-w-6xl gap-8 transition-all duration-300 ${isFullScreen ? 'grid-cols-3' : 'md:grid-cols-2'}`}>
          {services.map((service) => (
            <Button
              key={service.id}
              disabled={processing}
              onClick={() => handleTakeQueue(service.id)}
              className="h-36 rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-300 to-gray-700 text-2xl font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:border-green-500 hover:text-green-400"
            >
              {service.name}
            </Button>
          ))}
        </div>

        {!isFullScreen && (
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
        )}

        {isFullScreen && open && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-950 p-10 text-center text-white shadow-2xl">
              <h2 className="text-lg tracking-wide text-gray-400">Nomor Antrian Anda</h2>

              <div className="space-y-6 py-8">
                <p className="text-sm tracking-widest text-green-400 uppercase">{serviceName}</p>

                <p className="text-8xl font-extrabold tracking-widest">{queueNumber}</p>

                <p className="text-xs text-gray-500">{takenAt}</p>
              </div>

              <Button onClick={() => setOpen(false)} className="h-12 w-full rounded-xl bg-green-600 text-lg hover:bg-green-700">
                Selesai
              </Button>
            </div>
          </div>
        )}
      </div>
    </WelcomeLayout>
  );
}
