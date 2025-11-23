// Using Web Audio API to avoid external assets dependencies
export const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Soft Bell / Chime
    osc.type = 'sine';
    
    // Slight frequency drop for a bell-like quality
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 1.5);

    // Bell envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05); // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5); // Long gentle decay

    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};