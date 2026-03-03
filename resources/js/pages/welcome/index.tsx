import { Button } from '@/components/ui/button';
import { useQueueAnnouncement } from '@/hooks/useQueueAnnouncement';
import { QueueCalls } from '@/types/queue_calls';
import { router, usePage } from '@inertiajs/react';
import { Maximize, Minimize } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import WelcomeLayout from './layouts/welcome-layout';

type PageProps = {
  activeCalls: QueueCalls[];
  recentCalls: QueueCalls[];
};

export default function Welcome() {
  const { activeCalls, recentCalls } = usePage<PageProps>().props;

  const { announce } = useQueueAnnouncement();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeCalls.length) return;

    activeCalls.forEach((call) => {
      const uniqueKey = `${call.queue.id}-${call.called_at}`;

      const text = `Nomor antrian ${call.queue.queue_number}, Silakan menuju ${call.counter.name}`;

      announce(uniqueKey, text);
    });
  }, [activeCalls, announce]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['activeCalls', 'recentCalls'] });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      displayRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowButton(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setShowButton(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    timeoutRef.current = setTimeout(() => {
      setShowButton(false);
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <WelcomeLayout>
      <div className="min-h-screen bg-black text-white">
        <div
          ref={displayRef}
          className={`relative transition-all duration-500 ${isFullScreen ? 'flex h-screen w-screen flex-col p-12' : 'mx-auto max-w-7xl p-10'}`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullScreen}
            className={`absolute top-6 right-6 z-50 text-white transition-opacity duration-300 ${showButton ? 'opacity-100' : 'opacity-0'}`}
          >
            {isFullScreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </Button>

          <div className="mb-8 text-center">
            <h1 className={`font-bold tracking-widest ${isFullScreen ? 'text-5xl' : 'text-4xl'}`}>NOMOR ANTRIAN</h1>
            <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-green-500" />
          </div>

          <div className={`grid flex-1 gap-10 ${isFullScreen ? 'grid-cols-2 grid-rows-2' : 'md:grid-cols-2'}`}>
            {activeCalls.slice(0, 4).map((call) => (
              <div
                key={call.id}
                className="flex flex-col items-center justify-center rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl"
              >
                <div className={`leading-none font-extrabold tracking-wider ${isFullScreen ? 'text-[120px]' : 'text-[90px]'}`}>
                  {call.queue.queue_number}
                </div>

                <div className={`mt-6 font-semibold text-green-400 ${isFullScreen ? 'text-3xl' : 'text-2xl'}`}>{call.counter.name}</div>

                <div className={`mt-3 text-gray-400 ${isFullScreen ? 'text-xl' : 'text-lg'}`}>
                  Panggilan ke {call.call_number.toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-8 ${isFullScreen ? 'grid grid-cols-4 gap-6 text-xl' : 'mx-auto max-w-4xl space-y-3 text-lg'}`}>
            {recentCalls.slice(0, 4).map((call) => (
              <div key={call.id} className="flex justify-between rounded-xl border border-gray-800 bg-gray-900/60 px-6 py-3">
                <span className="font-semibold">{call.queue.queue_number}</span>
                <span className="text-green-400">{call.counter.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WelcomeLayout>
  );
}
