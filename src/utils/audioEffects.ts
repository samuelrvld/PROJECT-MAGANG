// Sound Effects Utility for POS / Scanner Operations

// 1. Realistic Supermarket / Retail Barcode Scanner Beep (Zebra / Datalogic / Honeywell style)
export const playSupermarketBeep = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // High frequency crystal clear retail barcode scanner beep (~2637Hz - E7 note)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2637.02, ctx.currentTime);

    // Ultra-fast sharp envelope: instant rise, stable sustain, crisp cutoff
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.003);
    gain.gain.setValueAtTime(0.4, ctx.currentTime + 0.065);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.075);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
};

// 2. High-quality Rejection / Error sound (Professional dual-tone negative buzzer)
export const playErrorBuzzer = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Tone 1: Low-frequency warning pulse (330Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(330, now);
    gain1.gain.setValueAtTime(0.22, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.11);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Tone 2: Descending deeper rejection tone (220Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(220, now + 0.13);
    gain2.gain.setValueAtTime(0.24, now + 0.13);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.13);
    osc2.stop(now + 0.33);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
};
