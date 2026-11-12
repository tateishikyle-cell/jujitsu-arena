/**
 * Web Audio API procedural sound synthesizer for Jujutsu Hand Arena
 * No external audio files needed; runs 100% reliably in any environment.
 */

let audioCtx: AudioContext | null = null;
let muted = false;

try {
  muted = localStorage.getItem('jjk_sound_muted') === 'true';
} catch {
  muted = false;
}

function getContext(): AudioContext | null {
  if (muted) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const sound = {
  isMuted(): boolean {
    return muted;
  },

  toggleMute(): boolean {
    muted = !muted;
    try {
      localStorage.setItem('jjk_sound_muted', muted ? 'true' : 'false');
    } catch {}
    if (!muted) {
      this.playClick();
    }
    return muted;
  },

  haptic(pattern: number | number[] = 15): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  },

  // UI button tap
  playClick(): void {
    const ctx = getContext();
    if (!ctx) return;
    this.haptic(10);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  },

  // Hand clap (Hand Clap / Boogie Woogie sound)
  playClap(): void {
    const ctx = getContext();
    if (!ctx) return;
    this.haptic(20);
    const now = ctx.currentTime;

    // Noise burst for clap slap
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(2.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    // Resonant pop body
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.07);
    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  },

  // Cursed energy charge
  playCharge(): void {
    const ctx = getContext();
    if (!ctx) return;
    this.haptic(25);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc2.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.28);
    osc2.frequency.setValueAtTime(122, now);
    osc2.frequency.exponentialRampToValueAtTime(425, now + 0.28);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.28);

    osc.connect(gain);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.3);
    osc2.stop(now + 0.3);
  },

  // Basic strike / punch
  playHit(): void {
    const ctx = getContext();
    if (!ctx) return;
    this.haptic(35);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  },

  // Dismantle / Cleave / Slash
  playSlash(): void {
    const ctx = getContext();
    if (!ctx) return;
    this.haptic([20, 20, 40]);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(3.0, now);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  },

  // Domain Expansion (領域展開)
  playDomain(): void {
    const ctx = getContext();
    if (!ctx) return;
    this.haptic([80, 40, 120]);
    const now = ctx.currentTime;

    // Deep sub bass drone
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(65, now);
    sub.frequency.exponentialRampToValueAtTime(45, now + 0.8);
    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.85);

    // Eerie temple bell / cosmic harmonics
    [520, 780, 1040].forEach((freq, idx) => {
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(freq, now + 0.05 * idx);
      bellGain.gain.setValueAtTime(0.15 / (idx + 1), now + 0.05 * idx);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      bell.connect(bellGain);
      bellGain.connect(ctx.destination);
      bell.start(now + 0.05 * idx);
      bell.stop(now + 0.75);
    });
  },

  // Black Flash (黒閃) - Explosive impact
  playBlackFlash(): void {
    const ctx = getContext();
    if (!ctx) return;
    this.haptic([60, 30, 80, 30, 140]);
    const now = ctx.currentTime;

    // Distorted heavy sub punch
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(140, now);
    sub.frequency.exponentialRampToValueAtTime(35, now + 0.4);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    sub.connect(filter);
    filter.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.45);

    // Lightning spark transient
    const spark = ctx.createOscillator();
    const sparkGain = ctx.createGain();
    spark.type = 'square';
    spark.frequency.setValueAtTime(1800, now);
    spark.frequency.exponentialRampToValueAtTime(200, now + 0.12);
    sparkGain.gain.setValueAtTime(0.25, now);
    sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    spark.connect(sparkGain);
    sparkGain.connect(ctx.destination);
    spark.start(now);
    spark.stop(now + 0.12);
  },

  // Reverse Cursed Technique (反転術式) - Healing arpeggio
  playHeal(): void {
    const ctx = getContext();
    if (!ctx) return;
    this.haptic(20);
    const now = ctx.currentTime;
    const notes = [330, 415, 494, 660, 830]; // E major pentatonic

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.05;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  },

  // Hollow Purple (虚式・紫)
  playPurple(): void {
    const ctx = getContext();
    if (!ctx) return;
    this.haptic([40, 20, 60, 20, 160]);
    const now = ctx.currentTime;

    const oscBlue = ctx.createOscillator();
    const oscRed = ctx.createOscillator();
    const gain = ctx.createGain();

    oscBlue.type = 'sine';
    oscBlue.frequency.setValueAtTime(260, now);
    oscBlue.frequency.exponentialRampToValueAtTime(740, now + 0.5);

    oscRed.type = 'sawtooth';
    oscRed.frequency.setValueAtTime(740, now);
    oscRed.frequency.exponentialRampToValueAtTime(260, now + 0.5);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    oscBlue.connect(gain);
    oscRed.connect(gain);
    gain.connect(ctx.destination);
    oscBlue.start(now);
    oscRed.start(now);
    oscBlue.stop(now + 0.55);
    oscRed.stop(now + 0.55);
  }
};
