/**
 * MusicPlayer: hyper-dark mini player with Spotify-style lyrics
 * Sits at the bottom of the battlefield, nearly invisible until hovered.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { BATTLE_TRACKS, type Track } from "@/assets/music/tracks";

interface MusicPlayerProps {
  /** When true the player auto-plays; when false it fades out & stops */
  active: boolean;
}

/* ── Shuffle helper (Fisher-Yates) ────────────────────────────── */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Tiny equalizer bars ─────────────────────────────────────── */
const eqKeyframes = `
@keyframes eq1 { 0%,100%{height:20%} 50%{height:90%} }
@keyframes eq2 { 0%,100%{height:40%} 40%{height:95%} 70%{height:25%} }
@keyframes eq3 { 0%,100%{height:60%} 30%{height:20%} 60%{height:85%} }
@keyframes eq4 { 0%,100%{height:30%} 50%{height:70%} 80%{height:95%} }
@keyframes eq5 { 0%,100%{height:50%} 35%{height:90%} 65%{height:30%} }
`;

function Equalizer({ playing }: { playing: boolean }) {
  const bars = [
    { anim: "eq1", dur: "0.8s" },
    { anim: "eq2", dur: "0.65s" },
    { anim: "eq3", dur: "0.75s" },
    { anim: "eq4", dur: "0.9s" },
    { anim: "eq5", dur: "0.7s" },
  ];
  return (
    <>
      <style>{eqKeyframes}</style>
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1.5,
        height: 10,
        padding: "0 2px",
      }}>
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              width: 1.5,
              borderRadius: 1,
              background: "rgba(140,180,160,0.55)",
              height: playing ? undefined : "20%",
              animation: playing ? `${b.anim} ${b.dur} ease-in-out infinite` : "none",
              transition: "height 0.3s ease",
            }}
          />
        ))}
      </div>
    </>
  );
}

export default function MusicPlayer({ active }: MusicPlayerProps) {
  /* ── Playlist state ─────────────────────────────────────────── */
  const [playlist, setPlaylist] = useState<Track[]>(BATTLE_TRACKS);
  const [trackIdx, setTrackIdx] = useState(0);
  const [shuffled, setShuffled] = useState(false);

  /* ── Playback state ─────────────────────────────────────────── */
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [progress, setProgress] = useState(0);   // 0-1
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [hovered, setHovered] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = playlist[trackIdx] ?? BATTLE_TRACKS[0];

  /* ── Audio element management ───────────────────────────────── */
  const createAudio = useCallback((t: Track) => {
    // Cleanup previous
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.removeAttribute("src");
    }
    const a = new Audio(t.src);
    a.volume = volume;
    a.loop = false;
    audioRef.current = a;

    a.addEventListener("loadedmetadata", () => setDuration(a.duration));
    a.addEventListener("timeupdate", () => {
      setCurrentTime(a.currentTime);
      if (a.duration) setProgress(a.currentTime / a.duration);
    });
    a.addEventListener("ended", () => handleNext());

    return a;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  /* ── Start / stop based on `active` prop ────────────────────── */
  useEffect(() => {
    if (active) {
      const a = createAudio(track);
      a.play().catch(() => {});
      setPlaying(true);
    } else {
      // Fade out
      if (audioRef.current) {
        const a = audioRef.current;
        if (fadeRef.current) clearInterval(fadeRef.current);
        fadeRef.current = setInterval(() => {
          if (a.volume > 0.02) {
            a.volume = Math.max(0, a.volume - 0.015);
          } else {
            clearInterval(fadeRef.current!);
            fadeRef.current = null;
            a.pause();
            a.currentTime = 0;
            setPlaying(false);
            setProgress(0);
            setCurrentTime(0);
          }
        }, 80);
      }
    }
    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  /* ── Sync volume to audio ───────────────────────────────────── */
  useEffect(() => {
    if (audioRef.current && playing) audioRef.current.volume = volume;
  }, [volume, playing]);

  /* ── Controls ───────────────────────────────────────────────── */
  const playTrack = useCallback((idx: number) => {
    const t = playlist[idx % playlist.length];
    const realIdx = idx % playlist.length;
    setTrackIdx(realIdx);
    setProgress(0);
    setCurrentTime(0);
    const a = createAudio(t);
    a.play().catch(() => {});
    setPlaying(true);
  }, [playlist, createAudio]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing]);

  const handleStop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const handleNext = useCallback(() => {
    playTrack(trackIdx + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx, playTrack]);

  const handlePrev = useCallback(() => {
    // If more than 3 seconds in, restart; otherwise prev track
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setProgress(0);
        setCurrentTime(0);
      }
    } else {
      playTrack((trackIdx - 1 + playlist.length) % playlist.length);
    }
  }, [currentTime, trackIdx, playlist.length, playTrack]);

  const handleShuffle = useCallback(() => {
    if (shuffled) {
      setPlaylist(BATTLE_TRACKS);
      setShuffled(false);
    } else {
      setPlaylist(shuffleArray(BATTLE_TRACKS));
      setShuffled(true);
    }
  }, [shuffled]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
    setProgress(pct);
  }, [duration]);

  /* ── Format time ────────────────────────────────────────────── */
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  /* ── Full lyrics panel (static, scrollable) ──────────────────── */
  const lyricsRef = useRef<HTMLDivElement | null>(null);

  // Scroll to top when track changes or panel opens
  useEffect(() => {
    if (showLyrics && lyricsRef.current) {
      lyricsRef.current.scrollTop = 0;
    }
  }, [showLyrics, trackIdx]);

  const renderLyrics = () => {
    const lines = track.lyrics;
    if (!showLyrics || !lines.length) return null;

    return (
      <div style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: 300,
        maxHeight: 300,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        // Fade all edges to nothing
        maskImage: "radial-gradient(ellipse 85% 90% at 50% 50%, white 40%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(ellipse 85% 90% at 50% 50%, white 40%, transparent 72%)",
      }}>
        {/* Background layer - soft dark cloud */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 85% at 50% 48%, rgba(2,2,5,0.95) 0%, rgba(1,1,3,0.7) 50%, transparent 100%)",
          backdropFilter: "blur(20px) saturate(0.5)",
          WebkitBackdropFilter: "blur(20px) saturate(0.5)",
          pointerEvents: "none",
        }} />

        {/* Header */}
        <div style={{
          position: "relative",
          padding: "14px 16px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{
            fontSize: 8,
            fontWeight: 500,
            color: "rgba(140,180,160,0.3)",
            letterSpacing: 2.5,
            textTransform: "uppercase",
          }}>
            Lyrics
          </span>
          <span style={{
            fontSize: 7.5,
            color: "rgba(120,120,120,0.2)",
            fontStyle: "italic",
            letterSpacing: 0.3,
          }}>
            {track.title}
          </span>
        </div>

        {/* Scrollable lyrics body */}
        <div
          ref={lyricsRef}
          style={{
            position: "relative",
            flex: 1,
            overflowY: "auto",
            padding: "6px 24px 20px",
            scrollbarWidth: "none",
            msOverflowStyle: "none" as React.CSSProperties["msOverflowStyle"],
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{
              fontSize: 9.5,
              fontWeight: line ? 400 : undefined,
              color: line ? "rgba(180,175,165,0.45)" : "transparent",
              lineHeight: 2,
              textAlign: "center",
              minHeight: line ? undefined : 8,
              letterSpacing: 0.3,
            }}>
              {line || "\u00A0"}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ── Render ──────────────────────────────────────────────────── */
  if (!active && !playing) return null;

  const baseOpacity = hovered ? 0.85 : 0.45;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: 260,
        marginRight: 40,
        opacity: baseOpacity,
        transition: "opacity 0.5s ease",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "visible",
      }}
    >
      {/* Lyrics */}
      {renderLyrics()}

      {/* Player body */}
      <div style={{
        width: "100%",
        background: "linear-gradient(180deg, rgba(8,8,12,0.7) 0%, rgba(4,4,8,0.85) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 10,
        padding: "6px 12px 8px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}>
        {/* Track title row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
        }}>
          <div style={{
            fontSize: 9,
            fontWeight: 500,
            color: "rgba(200,195,185,0.8)",
            letterSpacing: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}>
            <Equalizer playing={playing} />
            {track.title}
          </div>
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 9,
              color: showLyrics ? "rgba(140,180,160,0.7)" : "rgba(100,100,100,0.5)",
              padding: "0 2px",
              transition: "color 0.2s",
            }}
            title={showLyrics ? "Hide lyrics" : "Show lyrics"}
          >
            Aa
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 7.5, color: "rgba(150,150,150,0.5)", minWidth: 24, textAlign: "right" }}>
            {fmt(currentTime)}
          </span>
          <div
            onClick={handleSeek}
            style={{
              flex: 1,
              height: 3,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 2,
              cursor: "pointer",
              position: "relative",
            }}
          >
            <div style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: "rgba(140,180,160,0.5)",
              borderRadius: 2,
              transition: "width 0.3s linear",
            }} />
            {/* Thumb dot */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: `${progress * 100}%`,
              transform: "translate(-50%, -50%)",
              width: hovered ? 7 : 0,
              height: hovered ? 7 : 0,
              borderRadius: "50%",
              background: "rgba(180,210,190,0.8)",
              transition: "all 0.2s",
            }} />
          </div>
          <span style={{ fontSize: 7.5, color: "rgba(150,150,150,0.5)", minWidth: 24 }}>
            {fmt(duration)}
          </span>
        </div>

        {/* Controls row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}>
          {/* Shuffle */}
          <Btn
            onClick={handleShuffle}
            title="Shuffle"
            active={shuffled}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </Btn>

          {/* Prev */}
          <Btn onClick={handlePrev} title="Previous">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="4" width="3" height="16" rx="1" />
              <polygon points="22 4 9 12 22 20" />
            </svg>
          </Btn>

          {/* Stop */}
          <Btn onClick={handleStop} title="Stop">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </Btn>

          {/* Play/Pause (larger) */}
          <Btn onClick={handlePlayPause} title={playing ? "Pause" : "Play"} size="lg">
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="3" width="5" height="18" rx="1" />
                <rect x="14" y="3" width="5" height="18" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21" />
              </svg>
            )}
          </Btn>

          {/* Next */}
          <Btn onClick={handleNext} title="Next">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="2 4 15 12 2 20" />
              <rect x="19" y="4" width="3" height="16" rx="1" />
            </svg>
          </Btn>

          {/* Volume */}
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginLeft: 4 }}>
            <Btn
              onClick={() => setVolume(v => v > 0 ? 0 : 0.3)}
              title={volume > 0 ? "Mute" : "Unmute"}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                {volume > 0 && (
                  <>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    {volume > 0.15 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                  </>
                )}
                {volume === 0 && (
                  <>
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                )}
              </svg>
            </Btn>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={e => setVolume(Number(e.target.value) / 100)}
              style={{
                width: 44,
                height: 3,
                appearance: "none",
                WebkitAppearance: "none",
                background: `linear-gradient(to right, rgba(140,180,160,0.5) ${volume * 100}%, rgba(255,255,255,0.08) ${volume * 100}%)`,
                borderRadius: 2,
                outline: "none",
                cursor: "pointer",
                accentColor: "rgba(140,180,160,0.7)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tiny button component ────────────────────────────────────── */
function Btn({ children, onClick, title, active, size }: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
  size?: "lg";
}) {
  const [hover, setHover] = useState(false);
  const isLg = size === "lg";
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: isLg ? 5 : 3,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active
          ? "rgba(140,180,160,0.9)"
          : hover
            ? "rgba(200,195,185,0.8)"
            : "rgba(140,140,140,0.5)",
        transition: "all 0.2s",
        transform: hover ? "scale(1.15)" : "scale(1)",
      }}
    >
      {children}
    </button>
  );
}
