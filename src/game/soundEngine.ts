// Procedural audio engine using Web Audio API
// Rich cinematic SFX - no external files needed

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

let masterVolume = 0.4;
let musicVolume = 0.14;

export function setMasterVolume(v: number) { masterVolume = Math.max(0, Math.min(1, v)); }
export function setMusicVolume(v: number) { musicVolume = Math.max(0, Math.min(1, v)); updateMusicGain(); }

// ── Shared utilities ──────────────────────

function createConvolver(ctx: AudioContext, decay = 1.5, length = 0.8): ConvolverNode {
  const rate = ctx.sampleRate;
  const len = rate * length;
  const buffer = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = buffer;
  return conv;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.3, detune = 0, filterFreq?: number) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(vol * masterVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  if (filterFreq) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 2;
    osc.connect(filter).connect(gain).connect(ctx.destination);
  } else {
    osc.connect(gain).connect(ctx.destination);
  }
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playReverbTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.2, detune = 0) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const reverb = createConvolver(ctx, 2, 0.6);
  const reverbGain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(vol * masterVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  reverbGain.gain.value = 0.3;
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.connect(reverb).connect(reverbGain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration: number, vol = 0.15, highPass = 0, lowPass = 4000) {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(Math.max(0, 1 - i / bufferSize), 1.5);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = vol * masterVolume;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = lowPass;
  let chain: AudioNode = source;
  chain = chain.connect(lp);
  if (highPass > 0) {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = highPass;
    chain = chain.connect(hp);
  }
  chain.connect(gain).connect(ctx.destination);
  source.start();
}

function playSweep(startFreq: number, endFreq: number, duration: number, type: OscillatorType = 'sine', vol = 0.15) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
  gain.gain.setValueAtTime(vol * masterVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

// ── SFX ──────────────────────────────────

export function sfxCardSelect() {
  playReverbTone(800, 0.1, 'sine', 0.15);
  playTone(1200, 0.06, 'sine', 0.1, 8);
}

export function sfxCardDeploy() {
  // Heavy whoosh
  playNoise(0.3, 0.25, 200, 2000);
  // Rising sweep
  playSweep(100, 600, 0.2, 'sine', 0.2);
  setTimeout(() => {
    // Thunderous slam
    playTone(50, 0.5, 'sine', 0.5);
    playTone(80, 0.35, 'triangle', 0.3);
    playNoise(0.2, 0.35, 0, 600);
    // Stone crack
    playNoise(0.08, 0.3, 1000, 4000);
  }, 100);
  // Magical shimmer cascade
  setTimeout(() => {
    playReverbTone(1400, 0.2, 'sine', 0.1);
    playReverbTone(2100, 0.15, 'sine', 0.07, 12);
    playReverbTone(2800, 0.12, 'sine', 0.05, -8);
  }, 200);
  // Deep reverb boom
  setTimeout(() => {
    playReverbTone(40, 0.6, 'sine', 0.2);
  }, 120);
}

export function sfxAttack(tribe?: string) {
  switch (tribe) {
    case 'Emberheart Pact':
      sfxAttackFire();
      break;
    case 'Ironroot Bastion':
      sfxAttackEarth();
      break;
    case 'Radiant Sanctum':
      sfxAttackLight();
      break;
    case 'Obsidian Veil':
      sfxAttackShadow();
      break;
    default:
      sfxAttackGeneric();
      break;
  }
}

function sfxAttackGeneric() {
  playSweep(2000, 200, 0.15, 'sawtooth', 0.12);
  playNoise(0.15, 0.35, 500, 3000);
  setTimeout(() => {
    playTone(80, 0.25, 'sine', 0.3);
    playNoise(0.1, 0.25, 0, 800);
    playReverbTone(3200, 0.1, 'sine', 0.06);
  }, 60);
  setTimeout(() => {
    playSweep(400, 100, 0.2, 'triangle', 0.1);
  }, 120);
}

// Fire - crackling whoosh, explosive burst, searing hiss
function sfxAttackFire() {
  // Fiery whoosh
  playNoise(0.2, 0.35, 800, 5000);
  playSweep(150, 1200, 0.15, 'sawtooth', 0.15);
  // Crackle
  setTimeout(() => {
    playNoise(0.08, 0.3, 3000, 8000);
    playNoise(0.06, 0.25, 4000, 10000);
  }, 40);
  // Explosive burst
  setTimeout(() => {
    playTone(60, 0.3, 'sine', 0.35);
    playNoise(0.15, 0.3, 100, 1500);
    playSweep(800, 200, 0.12, 'square', 0.08);
  }, 80);
  // Searing hiss tail
  setTimeout(() => {
    playNoise(0.25, 0.12, 2000, 7000);
    playSweep(3000, 1000, 0.2, 'sine', 0.04);
  }, 150);
}

// Earth - boulder rumble, deep stone crack, ground slam
function sfxAttackEarth() {
  // Deep rumble
  playTone(35, 0.5, 'sine', 0.4);
  playTone(55, 0.4, 'triangle', 0.25);
  // Stone grind
  playNoise(0.25, 0.3, 50, 600);
  // Boulder impact
  setTimeout(() => {
    playTone(25, 0.6, 'sine', 0.45);
    playNoise(0.15, 0.4, 0, 400);
    // Stone crack
    playNoise(0.06, 0.35, 1500, 5000);
  }, 80);
  // Rubble scatter
  setTimeout(() => {
    playNoise(0.2, 0.15, 200, 2000);
    playTone(70, 0.2, 'triangle', 0.1);
    playNoise(0.08, 0.12, 3000, 6000);
  }, 160);
  // Ground settle
  setTimeout(() => {
    playTone(40, 0.35, 'sine', 0.12);
  }, 250);
}

// Light - crystalline chime, prismatic ring, radiant burst
function sfxAttackLight() {
  // Crystal chime
  playReverbTone(2200, 0.15, 'sine', 0.18);
  playReverbTone(3300, 0.12, 'sine', 0.12, 8);
  // Prismatic shimmer
  setTimeout(() => {
    playReverbTone(1800, 0.18, 'sine', 0.14);
    playReverbTone(2600, 0.14, 'sine', 0.1, -5);
    playNoise(0.06, 0.08, 6000, 12000); // sparkle
  }, 50);
  // Radiant burst
  setTimeout(() => {
    playSweep(600, 2400, 0.12, 'sine', 0.15);
    playReverbTone(4400, 0.1, 'sine', 0.06, 12);
    playTone(150, 0.15, 'sine', 0.18);
  }, 100);
  // Harmonic ring-out
  setTimeout(() => {
    playReverbTone(1600, 0.25, 'sine', 0.08);
    playReverbTone(2400, 0.2, 'sine', 0.05, 15);
    playNoise(0.08, 0.04, 8000, 14000);
  }, 180);
}

// 🌑 Shadow - eerie whisper, void tear, spectral slash
function sfxAttackShadow() {
  // Spectral whisper sweep
  playSweep(3000, 400, 0.2, 'sine', 0.1);
  playSweep(2000, 300, 0.18, 'sawtooth', 0.06);
  // Void tear
  setTimeout(() => {
    playNoise(0.12, 0.2, 100, 800);
    playSweep(100, 50, 0.25, 'sine', 0.15);
    playTone(60, 0.3, 'sine', 0.2);
  }, 60);
  // Shadow blade slice
  setTimeout(() => {
    playSweep(4000, 600, 0.08, 'sawtooth', 0.1);
    playNoise(0.06, 0.18, 1000, 4000);
  }, 120);
  // Eerie reverb tail
  setTimeout(() => {
    playReverbTone(300, 0.35, 'sine', 0.08, -12);
    playReverbTone(450, 0.3, 'triangle', 0.05, 8);
    playSweep(800, 200, 0.3, 'sine', 0.03);
  }, 180);
}

export function sfxDamage() {
  // Short impact thud - no tonal "ding" to avoid clashing with tribe attack SFX
  playNoise(0.08, 0.3, 0, 800);
  playTone(35, 0.15, 'sine', 0.2);
  // Brief crack
  setTimeout(() => {
    playNoise(0.04, 0.15, 1500, 5000);
  }, 30);
}

export function sfxDeath() {
  // Soul departing sweep
  playSweep(500, 30, 0.8, 'sawtooth', 0.12);
  // Deep rumble
  playNoise(0.5, 0.2, 0, 300);
  playTone(35, 0.7, 'sine', 0.2);
  // Glass shatter
  setTimeout(() => {
    playNoise(0.1, 0.2, 2000, 8000);
    playReverbTone(200, 0.4, 'triangle', 0.08);
  }, 100);
  // Ethereal whisper
  setTimeout(() => {
    playSweep(800, 2000, 0.3, 'sine', 0.04);
    playReverbTone(1200, 0.3, 'sine', 0.05, 15);
  }, 250);
}

export function sfxTurnStart() {
  // War horn
  playTone(220, 0.5, 'sawtooth', 0.08, 0, 800);
  playReverbTone(440, 0.4, 'sine', 0.12);
  setTimeout(() => playReverbTone(660, 0.35, 'sine', 0.1), 100);
  setTimeout(() => playReverbTone(880, 0.3, 'sine', 0.08), 200);
  // Bell chime
  setTimeout(() => {
    playReverbTone(1760, 0.25, 'sine', 0.06);
  }, 300);
}

export function sfxEndTurn() {
  playReverbTone(440, 0.2, 'triangle', 0.12);
  playReverbTone(330, 0.25, 'triangle', 0.1);
  playSweep(600, 200, 0.3, 'sine', 0.06);
}

export function sfxVictory() {
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((f, i) => {
    setTimeout(() => {
      playReverbTone(f, 0.5, 'sine', 0.18);
      playReverbTone(f * 1.5, 0.4, 'sine', 0.08);
      if (i === notes.length - 1) {
        playReverbTone(f * 2, 0.6, 'sine', 0.06);
      }
    }, i * 140);
  });
  setTimeout(() => playNoise(0.3, 0.08, 4000, 12000), 500); // sparkle
}

export function sfxDefeat() {
  const notes = [400, 350, 280, 200, 120];
  notes.forEach((f, i) => {
    setTimeout(() => playReverbTone(f, 0.6, 'sawtooth', 0.1), i * 180);
  });
  setTimeout(() => {
    playNoise(0.6, 0.15, 0, 400);
    playSweep(300, 30, 1, 'sine', 0.08);
  }, 700);
}

export function sfxAbility() {
  // Arcane charge-up
  playSweep(200, 1200, 0.25, 'sine', 0.12);
  setTimeout(() => {
    playReverbTone(1000, 0.2, 'sine', 0.12);
    playReverbTone(1500, 0.15, 'triangle', 0.08);
  }, 80);
  setTimeout(() => {
    playReverbTone(800, 0.25, 'sine', 0.1, 20);
    playNoise(0.1, 0.08, 2000, 6000); // sparkle
  }, 160);
  // Release burst
  setTimeout(() => {
    playTone(400, 0.15, 'square', 0.06);
    playReverbTone(2000, 0.12, 'sine', 0.05);
  }, 240);
}

export function sfxHeal() {
  // Warm ascending chimes
  const notes = [600, 800, 1000, 1200];
  notes.forEach((f, i) => {
    setTimeout(() => playReverbTone(f, 0.25, 'sine', 0.1, i * 5), i * 80);
  });
  // Soft shimmer
  setTimeout(() => playNoise(0.15, 0.04, 4000, 10000), 200);
}

// ── SPEECH SYNTHESIS (Card Voiceovers) ─────

let speechEnabled = true;

export function setSpeechEnabled(v: boolean) { speechEnabled = v; }
export function isSpeechEnabled() { return speechEnabled; }

// Female characters by name
const FEMALE_CHARACTERS = new Set([
  'Lyra Voidstep', 'Mira Shadowlace', 'Nyx Hollowshade', 'Sable Driftmere',
  'Aurelia Dawnspire', 'Celestine Brightvow', 'Sera Lightweaver', 'Elara Dawnpetal',
  'Miriel Sunstitch', 'Lenna Hallowed', 'Ivy Luminara',
  'Crimson Morrigan', 'Ashara Flameveil', 'Cinder Voss',
  'Willow Deeproot', 'Petra Stoneweave', 'Fern Willowbend',
  'Sage Mossmantle',
]);

function getCharacterGender(name: string): 'female' | 'male' {
  return FEMALE_CHARACTERS.has(name) ? 'female' : 'male';
}

export function speakQuote(quote: string, tribe?: string, characterName?: string) {
  if (!speechEnabled || !('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(quote);
  const gender = characterName ? getCharacterGender(characterName) : 'male';
  
  // Dramatic voice settings per tribe
  switch (tribe) {
    case 'Obsidian Veil':
      utterance.pitch = gender === 'female' ? 0.9 : 0.6;
      utterance.rate = 0.75;
      break;
    case 'Radiant Sanctum':
      utterance.pitch = gender === 'female' ? 1.3 : 0.9;
      utterance.rate = 0.85;
      break;
    case 'Emberheart Pact':
      utterance.pitch = gender === 'female' ? 1.0 : 0.7;
      utterance.rate = 0.9;
      break;
    case 'Ironroot Bastion':
      utterance.pitch = gender === 'female' ? 0.85 : 0.5;
      utterance.rate = 0.7;
      break;
    default:
      utterance.pitch = gender === 'female' ? 1.1 : 0.8;
      utterance.rate = 0.8;
      break;
  }

  utterance.volume = Math.min(1, masterVolume * 1.2);

  // Pick a voice matching the character's gender
  const voices = window.speechSynthesis.getVoices();
  const genderKeyword = gender === 'female' ? 'female' : 'male';
  const preferred =
    voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes(genderKeyword))
    || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes(gender === 'female' ? 'woman' : 'man'))
    || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes(gender === 'female' ? 'samantha' : 'daniel'))
    || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes(gender === 'female' ? 'karen' : 'james'))
    || voices.find(v => v.lang.startsWith('en') && v.localService)
    || voices.find(v => v.lang.startsWith('en'));
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

// ── AMBIENT MUSIC ──────────────────────────

let musicNodes: { oscs: OscillatorNode[]; gains: GainNode[]; masterGain: GainNode } | null = null;
let musicPlaying = false;

function updateMusicGain() {
  if (musicNodes) {
    musicNodes.masterGain.gain.setTargetAtTime(musicVolume * masterVolume, getCtx().currentTime, 0.1);
  }
}

export function startMusic() {
  if (musicPlaying) return;
  musicPlaying = true;
  const ctx = getCtx();

  const masterGain = ctx.createGain();
  masterGain.gain.value = musicVolume * masterVolume;
  masterGain.connect(ctx.destination);

  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  const drones: { freq: number; type: OscillatorType; vol: number; detune: number }[] = [
    { freq: 55, type: 'sine', vol: 0.4, detune: 0 },
    { freq: 82.4, type: 'sine', vol: 0.25, detune: -5 },
    { freq: 110, type: 'triangle', vol: 0.12, detune: 3 },
    { freq: 165, type: 'sine', vol: 0.06, detune: -8 },
    { freq: 220, type: 'sine', vol: 0.03, detune: 7 },
  ];

  drones.forEach(d => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = d.type;
    osc.frequency.value = d.freq;
    osc.detune.value = d.detune;
    gain.gain.value = d.vol;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.05 + Math.random() * 0.08;
    lfoGain.gain.value = d.vol * 0.3;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();

    osc.connect(gain).connect(masterGain);
    osc.start();
    oscs.push(osc, lfo);
    gains.push(gain);
  });

  musicNodes = { oscs, gains, masterGain };
}

export function stopMusic() {
  if (!musicNodes || !musicPlaying) return;
  musicPlaying = false;
  const ctx = getCtx();
  musicNodes.masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
  const nodes = musicNodes;
  setTimeout(() => {
    nodes.oscs.forEach(o => { try { o.stop(); } catch {} });
    nodes.masterGain.disconnect();
  }, 2000);
  musicNodes = null;
}

export function isMusicPlaying() { return musicPlaying; }
