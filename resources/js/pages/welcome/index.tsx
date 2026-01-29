import { QueueCalls } from '@/types/queue_calls';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import WelcomeLayout from './layouts/welcome-layout';

type PageProps = {
  activeCalls: QueueCalls[];
  recentCalls: QueueCalls[];
};

export default function Welcome() {
  const { activeCalls, recentCalls } = usePage<PageProps>().props;

//   const speakText = (text: string) => {
//     return new Promise<void>((resolve) => {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.lang = 'id-ID';
//       utterance.rate = 0.9;

//       utterance.onend = () => resolve();

//       window.speechSynthesis.speak(utterance);
//     });
//   }

  const spokenCallsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unlockAudio = () => {
      const utterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(utterance);
      window.removeEventListener('click', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
  }, []);


    useEffect(() => {
        if (!activeCalls.length) return;
        if (!window.speechSynthesis) return;

        const speakQueue = async () => {
        for (const call of activeCalls) {
            const uniqueKey = `${call.queue.id}-${call.called_at}`;

            if (spokenCallsRef.current.has(uniqueKey)) continue;

            spokenCallsRef.current.add(uniqueKey);

            const utterance = new SpeechSynthesisUtterance(`Nomor antrian ${call.queue.queue_number}, silakan menuju ${call.counter.name}`);

            utterance.lang = 'id-ID';
            utterance.rate = 0.9;

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);

            await new Promise((resolve) => {
            utterance.onend = resolve;
            });
        }
    };

    speakQueue();
    }, [activeCalls]);


  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['activeCalls', 'recentCalls'] });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <WelcomeLayout>
      <div className="min-h-screen bg-black p-10 text-white">
        <h1 className="mb-12 text-center text-4xl">Nomor Antrian</h1>

        {activeCalls.length > 0 ? (
          <div className="mb-16 grid gap-10 md:grid-cols-2">
            {activeCalls.map((call) => (
              <div key={call.id} className="rounded-2xl bg-gray-900 p-10 text-center shadow-lg">
                <div className="text-7xl font-bold">{call.queue.queue_number}</div>

                <div className="mt-4 text-2xl text-green-400">{call.counter.name}</div>

                <div className="mt-2 text-sm text-gray-400">Dipanggil ke-{call.call_number}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-16 text-center text-3xl">Belum ada antrian dipanggil</div>
        )}

        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-xl">Riwayat Panggilan</h2>

          {recentCalls.map((call) => (
            <div key={call.id} className="flex justify-between border-b border-gray-700 py-2">
              <span>{call.queue.queue_number}</span>
              <span>{call.counter.name}</span>
            </div>
          ))}
        </div>
      </div>
    </WelcomeLayout>
  );
}
