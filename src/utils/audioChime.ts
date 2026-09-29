/**
 * Generates an executive brand chime using the browser's Web Audio API.
 * Synthesizes harmonious frequencies with a gentle fade-in and reverb-like tail,
 * completely client-side without external asset dependencies or CORS issues.
 */
export const playVizioBrandChime = (volume: number = 0.3) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.exponentialRampToValueAtTime(volume, now + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
    masterGain.connect(ctx.destination);

    // Modern corporate triad chord (C5, E5, G5, C6) with subtle detune
    const chordNotes = [
      { freq: 523.25, type: 'sine' as OscillatorType, delay: 0 },       // C5
      { freq: 659.25, type: 'sine' as OscillatorType, delay: 0.04 },    // E5
      { freq: 783.99, type: 'triangle' as OscillatorType, delay: 0.08 },// G5
      { freq: 1046.5, type: 'sine' as OscillatorType, delay: 0.12 },    // C6 sparkle
      { freq: 261.63, type: 'sine' as OscillatorType, delay: 0 },       // C4 warm bass
    ];

    chordNotes.forEach(({ freq, type, delay }) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + delay);

      noteGain.gain.setValueAtTime(0.001, now + delay);
      noteGain.gain.linearRampToValueAtTime(0.25, now + delay + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.4);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + 1.5);
    });

    // Auto-close audio context after sound finishes
    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // Ignore
      }
    }, 2000);
  } catch (err) {
    console.warn('Audio chime could not be played:', err);
  }
};

/**
 * Message send notification sound (subtle pop)
 */
export const playMessagePopSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // Ignore
  }
};
