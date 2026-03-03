import { useCallback, useEffect, useRef } from 'react';

export function useQueueAnnouncement() {
  const spokenCallsRef = useRef<Set<string>>(new Set());
  const speechQueueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const isSpeakingRef = useRef(false);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bellAudioRef.current = new Audio('/sounds/announcement_bell_notifications.mp3');
    bellAudioRef.current.preload = 'auto';
  }, []);

  const getIndonesianVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find((v) => v.lang === 'id-ID') || voices.find((v) => v.lang.includes('id')) || voices[0];
  };

  const processQueue = useCallback(() => {
    if (isSpeakingRef.current) return;
    if (!speechQueueRef.current.length) return;

    const utterance = speechQueueRef.current.shift();
    if (!utterance) return;

    isSpeakingRef.current = true;

    const speak = () => {
      utterance.onend = () => {
        isSpeakingRef.current = false;
        processQueue();
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    if (bellAudioRef.current) {
      bellAudioRef.current.currentTime = 0;
      bellAudioRef.current
        .play()
        .then(() => {
          bellAudioRef.current!.onended = speak;
        })
        .catch(() => speak());
    } else {
      speak();
    }
  }, []);

  const announce = useCallback(
    (key: string, text: string) => {
      if (spokenCallsRef.current.has(key)) return;

      spokenCallsRef.current.add(key);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = getIndonesianVoice();
      utterance.lang = 'id-ID';
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 1.5;

      speechQueueRef.current.push(utterance);
      processQueue();
    },
    [processQueue],
  );

  return { announce };
}
