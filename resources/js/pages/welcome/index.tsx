import { QueueCalls } from '@/types/queue_calls';
import { router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef } from 'react';
import WelcomeLayout from './layouts/welcome-layout';

type PageProps = {
  activeCalls: QueueCalls[];
  recentCalls: QueueCalls[];
};

export default function Welcome() {
  const { activeCalls, recentCalls } = usePage<PageProps>().props;

  const spokenCallsRef = useRef<Set<string>>(new Set());
  const speechQueueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const isSpeakingRef = useRef(false);

  const getIndonesianVoice = () => {
    const voices = window.speechSynthesis.getVoices();

    return (
      voices.find((v) => v.lang === 'id-ID') ||
      voices.find((v) => v.lang.includes('id')) ||
      voices.find((v) => v.name.toLowerCase().includes('female')) ||
      voices[0]
    );
  };

  const processSpeechQueue = useCallback(() => {
    if (isSpeakingRef.current) return;
    if (!speechQueueRef.current.length) return;

    const utterance = speechQueueRef.current.shift();
    if (!utterance) return;

    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      processSpeechQueue();
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

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

    activeCalls.forEach((call) => {
      const uniqueKey = `${call.queue.id}-${call.called_at}`;

      if (spokenCallsRef.current.has(uniqueKey)) return;

      spokenCallsRef.current.add(uniqueKey);

      const text = `Nomor antrian ${call.queue.queue_number}~ silakan menuju ${call.counter.name}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = getIndonesianVoice();
      utterance.lang = 'id-ID';
      utterance.pitch = 1.6;
      utterance.rate = 0.8;
      utterance.volume = 1;
      speechQueueRef.current.push(utterance);
    });
    processSpeechQueue();
  }, [activeCalls, processSpeechQueue]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['activeCalls', 'recentCalls'] });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    console.log(voices);
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

                <div className="mt-2 text-sm text-gray-400">
                  Dipanggil ke-
                  {call.call_number.toString().padStart(2, '0')}
                </div>
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
