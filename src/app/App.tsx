import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Mail,
  Twitter,
  Layers,
  Music2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import avatarSrc from "@/imports/SNS____.png";
import $ from "jquery";
// @ts-ignore - no type definitions published for this plugin
import "jquery.ripples";

// ─── Types ──────────────────────────────────────────────────────────────────

type Tag =
  | "VTuber"
  | "アイドル"
  | "かっこいい系"
  | "可愛い系"
  | "バラード系"
  | "バンド系"
  | "エレクトロ系";

type TabKey = "All" | Tag;

const ALL_TABS: TabKey[] = [
  "All",
  "VTuber",
  "アイドル",
  "かっこいい系",
  "可愛い系",
  "バラード系",
  "バンド系",
  "エレクトロ系",
];

interface Song {
  id: string;
  title: string;
  artist: string;
  role: string;
  tags: Tag[];
  youtubeId: string;
  featured?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SONGS: Song[] = [
  {
    id: "1",
    title: "かまちょ注意報！",
    artist: "赤桐ルイ feat. 椎乃実なつ",
    role: "作詞/作曲/編曲/ミックス",
    tags: ["VTuber", "可愛い系"],
    youtubeId: "9VmBqG2qOiY",
    featured: true,
  },
  {
    id: "2",
    title: "僕ら色の銀河",
    artist: "友絆リュリュ",
    role: "作詞/作曲/編曲/ミックス",
    tags: ["VTuber", "かっこいい系", "バラード系", "バンド系"],
    youtubeId: "I5MdhNn3AcQ",
    featured: true,
  },
  {
    id: "3",
    title: "名も無きお星様",
    artist: "蓬莱エマ",
    role: "作詞/作曲/編曲/ミックス",
    tags: ["VTuber", "バラード系", "バンド系"],
    youtubeId: "V1wET_baDOs",
  },
  {
    id: "4",
    title: "さくらいろうさぎ -5th Anniversary Ver.",
    artist: "卯丸とあ",
    role: "編曲/ミックス",
    tags: ["VTuber", "可愛い系", "エレクトロ系"],
    youtubeId: "ADn1DadWFGc",
  },
  {
    id: "5",
    title: "閃光フィラメント",
    artist: "なのぷー",
    role: "作詞/作曲/編曲/ミックス",
    tags: ["VTuber", "エレクトロ系"],
    youtubeId: "iWx4SjTM8Hc",
  },
  {
    id: "6",
    title: "絶賛！使い魔ちゅー☆",
    artist: "堕猫ぽよ",
    role: "作詞/作曲/編曲/ミックス",
    tags: ["VTuber", "エレクトロ系"],
    youtubeId: "rimbgx4Vr8E",
  },
  {
    id: "7",
    title: "星推し☆",
    artist: "天満スピカ",
    role: "作詞/作曲/編曲/ミックス",
    tags: ["VTuber", "可愛い系", "バンド系"],
    youtubeId: "kQmS_NuL49g",
  },
  {
    id: "8",
    title: "INterACT",
    artist: "ぴるびん",
    role: "作詞/作曲/編曲/ミックス",
    tags: ["VTuber", "かっこいい系", "バンド系"],
    youtubeId: "iBbnmTa9_jw",
  },
  {
    id: "9",
    title: "あの日の向日葵",
    artist: "陽葵ぜろ",
    role: "作詞/作曲/編曲/ミックス",
    tags: ["VTuber", "バラード系", "バンド系"],
    youtubeId: "_WkUS-f-7Hg",
  },
  {
    id: "10",
    title: "Little Brave Story",
    artist: "このアイドルはフィクションです。",
    role: "編曲",
    tags: ["アイドル"],
    youtubeId: "ksJ0IlLsYWo",
  },
  {
    id: "11",
    title: "君に夢中でパンクChu！",
    artist: "海月おとは",
    role: "作詞/作曲/編曲/ミックス",
    tags: ["アイドル", "可愛い系", "エレクトロ系"],
    youtubeId: "-MYEERtBtxs",
  },
  {
    id: "12",
    title: "君がいるだけでフルコンボ",
    artist: "南花音",
    role: "作詞/作曲/編曲/ミックス",
    tags: ["アイドル", "可愛い系", "バンド系"],
    youtubeId: "oTuvE_5jqdw",
    featured: true,
  },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── FadeIn wrapper ───────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 2s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 2s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold tracking-[0.3em] text-[#C41E3A] uppercase mb-3">
      {children}
    </p>
  );
}

// ─── SongCard ────────────────────────────────────────────────────────────────

function SongCard({
  song,
  onTagClick,
}: {
  song: Song;
  onTagClick?: (tag: Tag) => void;
}) {
  return (
    <article className="flex flex-col bg-card border border-border overflow-hidden group transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      {/* 16:9 YouTube embed */}
      <div className="relative w-full bg-muted" style={{ paddingTop: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${song.youtubeId}?enablejsapi=1`}
          title={song.title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-[15px] font-bold text-foreground leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
          {song.title} - {song.artist}
        </h3>
        <p className="text-xs font-medium text-[#C41E3A] tracking-wide">
          担当：{song.role.split("/").join(" / ")}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {song.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className="text-[10px] font-medium bg-secondary text-muted-foreground px-2 py-0.5 tracking-wide hover:bg-[#C41E3A] hover:text-white transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

// ─── ThumbMarquee ─────────────────────────────────────────────────────────────

function ThumbMarquee({ songs }: { songs: Song[] }) {
  const track = [...songs, ...songs]; // duplicated for a seamless loop
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<number | undefined>(undefined);

  // Both open and close share this duration so the motion feels symmetrical.
  const TRANSITION_MS = 800;

  const openSong = (song: Song) => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    setClosing(false);
    setActiveSong(song);
  };

  const closeSong = () => {
    setClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setActiveSong(null);
      setClosing(false);
    }, TRANSITION_MS);
  };

  // Background stays scrollable while the popup is open (fixed positioning
  // keeps the popup pinned center-screen regardless). Just handle Escape.
  useEffect(() => {
    if (!activeSong) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSong();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [activeSong]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-4 w-max"
        style={{ animation: "marqueeScroll 60s linear infinite" }}
      >
        {track.map((song, i) => (
          <button
            key={`${song.id}-${i}`}
            onClick={() => openSong(song)}
            className="w-36 sm:w-44 flex-shrink-0 group text-left"
          >
            <div className="aspect-video overflow-hidden bg-muted">
              <img
                src={`https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`}
                alt={song.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-[11px] font-medium text-foreground truncate">
              {song.title}
            </p>
            <p className="text-[10px] font-light text-muted-foreground truncate">
              {song.artist}
            </p>
          </button>
        ))}
      </div>

      {/* Edge fade masks so thumbnails don't hard-cut at the container edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-background to-transparent" />

      {/* Rendered via portal directly under <body> — this is the fix for two bugs:
          1) an ancestor FadeIn wrapper applies `transform`, which turns it into
             the containing block for `position: fixed` descendants, so the
             popup was centering on that box instead of the viewport.
          2) it now safely stacks above every other section (e.g. the "view all"
             button), since portal content is appended at the very end of <body>. */}
      {activeSong &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            onClick={closeSong}
          >
            <div
              className="absolute inset-0 bg-black/40"
              style={{
                animation: `${closing ? "backdropOut" : "backdropIn"} ${TRANSITION_MS}ms ease both`,
              }}
            />
            <div
              className="relative w-full max-w-3xl"
              style={{
                animation: `${closing ? "modalOut" : "modalIn"} ${TRANSITION_MS}ms cubic-bezier(0.16,1,0.3,1) both`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeSong}
                className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
                aria-label="閉じる"
              >
                <X size={26} />
              </button>
              <div className="relative w-full bg-black" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${activeSong.youtubeId}?autoplay=1&enablejsapi=1`}
                  title={activeSong.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-3 text-center text-sm font-bold text-white">
                {activeSong.title} - {activeSong.artist}
              </p>
            </div>
          </div>,
          document.body
        )}

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes backdropOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes modalOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────────

function Nav({
  currentPage,
  navigate,
}: {
  currentPage: string;
  navigate: (p: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToContact = () => {
    if (currentPage !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = [
    { label: "Home", action: () => navigate("/") },
    { label: "Works", action: () => navigate("/works") },
    { label: "Contact", action: scrollToContact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-sm font-black tracking-[0.2em] text-foreground hover:text-[#C41E3A] transition-colors"
        >
          赤桐ルイ
        </button>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ label, action }) => (
            <button
              key={label}
              onClick={() => { action(); setMenuOpen(false); }}
              className="text-xs font-medium tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            onClick={scrollToContact}
            className="text-[11px] font-bold tracking-widest border border-[#C41E3A] text-[#C41E3A] px-5 py-2 hover:bg-[#C41E3A] hover:text-white transition-colors"
          >
            制作依頼
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-6 flex flex-col gap-5">
          {links.map(({ label, action }) => (
            <button
              key={label}
              onClick={() => { action(); setMenuOpen(false); }}
              className="text-left text-sm font-medium tracking-wide text-foreground hover:text-[#C41E3A] transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroBackground() {
  // Deterministic pseudo-random waveform bars (stable across renders, no hydration mismatch)
  const bars = Array.from({ length: 64 }, (_, i) => {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const frac = seed - Math.floor(seed);
    return 8 + frac * 84; // height % between 8 and 92
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const el = waterRef.current;
    if (!container || !el) return;

    let ripplesInitialized = false;
    let idleTimer: number | undefined;

    // How long the mouse must sit still before the ripples are force-calmed.
    // Raise this for a longer "lingering" effect, lower it to settle sooner.
    const IDLE_MS = 2200;

    const rippleOptions = { 
      resolution: 384,
      dropRadius: 40,
      perturbance: 0.02,
    };

    const initRipples = () => {
      try {
        ($(el) as any).ripples(rippleOptions);
        ripplesInitialized = true;
      } catch (err) {
        console.error("jquery.ripples failed to initialize:", err);
      }
    };

    // The plugin has no built-in "settle faster" option — the wave decay rate is
    // fixed internally. So instead we detect mouse inactivity and force a reset
    // (destroy + reinit), which snaps the simulation back to flat/calm.
    const calmDown = () => {
      if (!ripplesInitialized) return;
      try {
        ($(el) as any).ripples("destroy");
      } catch {
        // ignore
      }
      ripplesInitialized = false;
      initRipples();
    };

    const handleActivity = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(calmDown, IDLE_MS);
    };

    // Manually compute a "cover" fit in JS (width/height in real px) instead of
    // relying on CSS `background-size: cover`, which this plugin doesn't handle
    // correctly on very wide/short elements — it was tiling a low-res simulation
    // texture instead of scaling the image, causing the striped/stretched look.
    const fitCover = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih || !cw || !ch) return;
      const scale = Math.max(cw / iw, ch / ih);
      el.style.width = `${Math.ceil(iw * scale)}px`;
      el.style.height = `${Math.ceil(ih * scale)}px`;
      if (ripplesInitialized) {
        try {
          ($(el) as any).ripples("updateSize");
        } catch {
          // ignore
        }
      }
    };

    const img = new Image();
    img.onload = () => {
      fitCover();
      initRipples();
    };
    img.src = avatarSrc;

    el.addEventListener("mousemove", handleActivity);
    window.addEventListener("resize", fitCover);

    return () => {
      window.removeEventListener("resize", fitCover);
      el.removeEventListener("mousemove", handleActivity);
      if (idleTimer) window.clearTimeout(idleTimer);
      if (ripplesInitialized) {
        try {
          ($(el) as any).ripples("destroy");
        } catch {
          // already unmounted
        }
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Waveform strip — purely decorative, never intercepts the mouse */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-[3px] opacity-[0.07] pointer-events-none z-10">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-[3px] bg-[#C41E3A] rounded-full"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Real water-ripple effect (jQuery Ripples / WebGL), mouse-interactive.
          Sized in JS to exactly cover the container (see fitCover above), then
          stretched 1:1 via background-size so the plugin never has to crop/tile it.
          Fades in starting slightly before the text block. */}
      <div
        ref={waterRef}
        className="absolute top-1/2 left-1/2"
        style={{
          transform: "translate(-50%, -50%)",
          backgroundImage: `url(${avatarSrc})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          filter: "blur(20px)",
          animation: "heroBgFadeIn 1s cubic-bezier(0.22,1,0.36,1) both",
        }}
      />

      <style>{`
        @keyframes heroBgFadeIn {
          from { opacity: 0; }
          to   { opacity: 0.75; }
        }
      `}</style>
    </div>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden"
    >
      {/* Thin red line accent */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#C41E3A] opacity-60 z-10" />

      <HeroBackground />

      {/* Soft white glow behind the text block for readability */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(255,255,255,0.85) 20%, rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto w-full">
        <div
          style={{
            opacity: 1,
            animation: "heroFadeIn 1s cubic-bezier(0.22,1,0.36,1) 300ms both",
          }}
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Music2 size={16} className="text-[#C41E3A]" strokeWidth={2} />
            <span className="text-base sm:text-lg font-bold tracking-[0.15em] text-foreground">
              作曲家 - 赤桐ルイ
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.2] tracking-tight text-foreground mt-2">
            TikTokでの制作楽曲の使用
            <br />
            <em className="not-italic text-[#C41E3A]">3,700件</em>を突破。
          </h1>

          <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground mt-3">
            累計再生回数は
            <em className="not-italic text-[#C41E3A]">120万回</em>
            を記録。
          </p>

          <div className="mt-8 space-y-1">
            <p className="text-base sm:text-lg font-light text-muted-foreground leading-relaxed">
              作詞、作曲、編曲、ミックス。すべてを一人で完結。
            </p>
          </div>
        </div>
      </div>

      {/* Scroll arrow — centered via fixed width + auto margins (inset-x-0 + mx-auto),
          not transform-based positioning, so there's no interaction with the
          bounce animation's own transform and no letter-spacing edge cases. */}
      <button
        onClick={() =>
          document.getElementById("profile")?.scrollIntoView({ behavior: "smooth" })
        }
        className="absolute bottom-10 inset-x-0 mx-auto z-10 w-24 flex flex-col items-center gap-1.5 text-center text-muted-foreground hover:text-[#C41E3A] transition-colors"
        style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
        aria-label="Scroll down"
      >
        <span className="text-[9px] font-bold">SCROLL</span>
        <ChevronDown size={16} />
      </button>

      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────

function Profile() {
  return (
    <section id="profile" className="py-32 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="flex flex-col md:flex-row items-center md:items-center justify-center gap-12 md:gap-16">
          {/* Avatar circle — swap src when image is provided */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-[#b5a090] overflow-hidden flex-shrink-0 ring-1 ring-border">
              <ImageWithFallback
                src={avatarSrc}
                alt="赤桐ルイ — 赤髪にヘッドフォンを着けた作曲家のイラスト"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left max-w-xl">
            <SectionLabel>Profile</SectionLabel>
            <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none mb-2">
              赤桐ルイ
            </h2>
            <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground mb-8">
              作詞家 / 作曲家 / 編曲家
            </p>
            <p className="text-sm font-light text-foreground leading-[2] text-left">
              自身名義の初リリース曲は、TikTokでのUGC使用3,700件を突破。UGC累計再生回数は120万回を記録。5歳よりピアノを学び、10代で作曲をはじめ、作詞・作曲・編曲・ミックスマスタリングまで、楽曲制作のすべての工程を一人で手がける。J-POP、バンドサウンドを軸に、エレクトロ、バラードまでジャンルを問わず制作。VTuber、アイドルシーンを中心に楽曲を提供している。
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Appeal Points ────────────────────────────────────────────────────────────

function AppealPoints() {
  const points = [
    {
      icon: <Layers size={22} strokeWidth={1.5} />,
      title: "ワンストップで制作",
      body: "作詞作曲からミックスまで一人で完結。窓口一つで制作の全工程をシームレスに。",
      delay: 0,
    },
    {
      icon: <Music2 size={22} strokeWidth={1.5} />,
      title: "幅広いジャンルに対応",
      body: "J-POP / バンド / エレクトロ / バラードまで幅広いジャンルの楽曲を制作可能。",
      delay: 120,
    },
    {
      icon: <RefreshCw size={22} strokeWidth={1.5} />,
      title: "無制限で修正対応",
      body: "修正回数は無制限。ご満足いただけるまで、何度でも修正対応いたします。",
      delay: 240,
    },
  ];

  return (
    <section className="py-24 px-6 bg-secondary border-t border-border">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <SectionLabel>About Production</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            制作について
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {points.map(({ icon, title, body, delay }) => (
            <FadeIn key={title} delay={delay} className="bg-background">
              <div className="p-8 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#C41E3A] flex-shrink-0">{icon}</span>
                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {title}
                  </h3>
                </div>
                <p className="text-xs font-light text-muted-foreground leading-loose">
                  {body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Music Section ────────────────────────────────────────────────────────────

function MusicSection({ navigate }: { navigate: (p: string) => void }) {
  const featured = SONGS.filter((s) => s.featured);

  return (
    <section className="py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <SectionLabel>Works</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            制作楽曲のご紹介
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {featured.map((song, i) => (
            <FadeIn key={song.id} delay={i * 100}>
              <SongCard
                song={song}
                onTagClick={(tag) => navigate(`/works?tag=${encodeURIComponent(tag)}`)}
              />
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Full-bleed — the marquee deliberately breaks out of the centered column
          so the flow of thumbnails feels continuous, not boxed in. */}
      <FadeIn delay={150} className="mb-14">
        <ThumbMarquee songs={SONGS} />
      </FadeIn>

      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="flex justify-center">
          <button
            onClick={() => navigate("/works")}
            className="inline-flex items-center gap-3 bg-[#C41E3A] text-white px-10 py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#a5192f] transition-colors"
          >
            すべての楽曲を見る
            <ArrowRight size={14} />
          </button>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setError(null);

    fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then(async (r) => {
        if (r.ok) {
          setSubmitted(true);
          form.reset();
        } else {
          // Try to surface Formspree's own error message if it sent one
          let message = `送信に失敗しました(エラーコード: ${r.status})。時間をおいて再度お試しください。`;
          try {
            const body = await r.json();
            if (body?.errors?.length) {
              message = body.errors.map((er: any) => er.message).join(" / ");
            }
          } catch {
            // response wasn't JSON — keep the generic message
          }
          setError(message);
        }
      })
      .catch(() => {
        setError("通信エラーが発生しました。ネット接続を確認のうえ、再度お試しください。");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <section
      id="contact"
      className="py-32 px-6 bg-secondary border-t border-border"
    >
      <div className="max-w-xl mx-auto">
        <FadeIn className="text-center mb-12">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">
            お問い合わせ
          </h2>
          <p className="text-sm font-light text-foreground leading-relaxed">
            楽曲制作のご依頼・ご相談、ぜひお気軽にお送りください。
            <br />
            通常2〜3営業日以内にご返信いたします。
            <br />
            ご連絡お待ちしております。
          </p>
        </FadeIn>

        {/* Direct contact — button-style cards */}
        <FadeIn delay={60} className="mb-10">
          <p className="text-center text-[11px] font-medium text-muted-foreground mb-4">
            こちらからもご連絡いただけます
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:lui.music.work@gmail.com"
              className="flex-1 flex items-center gap-3 border border-[#C41E3A] px-5 py-4 hover:bg-[#C41E3A] hover:text-white transition-colors group"
            >
              <Mail size={18} className="text-[#C41E3A] group-hover:text-white flex-shrink-0" />
              <span className="text-sm font-medium tracking-wide truncate">
                lui.music.work@gmail.com
              </span>
            </a>
            <a
              href="https://x.com/Akagiri_Lui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-3 border border-[#C41E3A] px-5 py-4 hover:bg-[#C41E3A] hover:text-white transition-colors group"
            >
              <Twitter size={18} className="text-[#C41E3A] group-hover:text-white flex-shrink-0" />
              <span className="text-sm font-medium tracking-wide">@Akagiri_Lui</span>
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          {submitted ? (
            <div className="text-center py-16 border border-border bg-background">
              <p className="text-sm font-medium text-foreground mb-1">
                送信が完了しました。
              </p>
              <p className="text-xs font-light text-muted-foreground">
                お問い合わせありがとうございます。近日中にご連絡いたします。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {(
                [
                  { name: "name", label: "お名前", type: "text", placeholder: "山田 太郎", required: true },
                  { name: "affiliation", label: "ご所属", type: "text", placeholder: "〇〇プロダクション", required: false },
                  { name: "email", label: "メールアドレス", type: "email", placeholder: "example@mail.com", required: true },
                ] as const
              ).map(({ name, label, type, placeholder, required }) => (
                <div key={name}>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-foreground mb-2">
                    {label}
                    {required && <span className="text-[#C41E3A] ml-1">*</span>}
                  </label>
                  <input
                    type={type}
                    name={name}
                    required={required}
                    placeholder={placeholder}
                    className="w-full border border-border bg-background px-4 py-3 text-sm font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#C41E3A] transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] text-foreground mb-2">
                  お問い合わせ内容 <span className="text-[#C41E3A]">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="楽曲制作のご依頼内容、ご予算、スケジュール感などをお書きください。"
                  className="w-full border border-border bg-background px-4 py-3 text-sm font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#C41E3A] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#C41E3A] text-white py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#a5192f] disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
              >
                {submitting ? "送信中..." : "送信する"}
              </button>

              {error && (
                <p className="text-xs font-medium text-[#C41E3A] text-center border border-[#C41E3A] px-4 py-3">
                  {error}
                </p>
              )}
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

// ─── Floating Contact Button ───────────────────────────────────────────────────

function FloatingContactButton({
  forceVisible,
  navigate,
}: {
  forceVisible: boolean;
  navigate: (p: string) => void;
}) {
  // On Works/Highlight, always shown. On Home, hidden in the hero, fades in
  // once scrolled past it, and fades out again while the contact section
  // itself is in view.
  const [visible, setVisible] = useState(forceVisible);

  useEffect(() => {
    if (forceVisible) {
      setVisible(true);
      return;
    }

    const heroEl = document.getElementById("hero");
    const contactEl = document.getElementById("contact");
    if (!heroEl || !contactEl) return;

    let pastHero = false;
    let inContact = false;
    const update = () => setVisible(pastHero && !inContact);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );
    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        inContact = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 }
    );

    heroObserver.observe(heroEl);
    contactObserver.observe(contactEl);

    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, [forceVisible]);

  const handleClick = () => {
    // GA4 custom event — lets us see how many people who arrived via the
    // outreach links (works/highlight) actually intended to make contact.
    (window as any).gtag?.("event", "contact_button_click", {
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    if (forceVisible) {
      // Land directly on the contact section — no anchor-style smooth scroll,
      // since animating a scroll right after a page switch reads as two
      // separate motions. A short delay just waits for Home's DOM to mount.
      navigate("/");
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "auto" });
      }, 50);
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 md:gap-4 rounded-full bg-[#C41E3A] text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-[#a5192f] transition-all duration-500 px-6 py-4 md:px-[48px] md:py-[30px] ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <Mail size={20} className="md:hidden flex-shrink-0" />
      <Mail size={36} className="hidden md:block flex-shrink-0" />
      <span className="text-sm md:text-[24px] font-bold tracking-wide whitespace-nowrap">
        お問い合わせ
      </span>
    </button>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer({ navigate }: { navigate: (p: string) => void }) {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-muted-foreground">
        <button
          onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="font-black tracking-[0.2em] text-foreground hover:text-[#C41E3A] transition-colors text-sm"
        >
          赤桐ルイ
        </button>
        <p>© {new Date().getFullYear()} 赤桐ルイ. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate("/works")}
            className="hover:text-foreground transition-colors"
          >
            Works
          </button>
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }, 80);
            }}
            className="hover:text-foreground transition-colors"
          >
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ navigate }: { navigate: (p: string) => void }) {
  return (
    <>
      <Hero />
      <Profile />
      <AppealPoints />
      <MusicSection navigate={navigate} />
      <Contact />
    </>
  );
}

// ─── Highlight Page (hidden, for outreach email links) ─────────────────────────

const HIGHLIGHT_SONG_IDS = ["1", "2", "4", "12", "9", "7"];

function HighlightPage() {
  // Temporarily override the robots meta tag while this page is mounted,
  // restoring whatever it was set to on the rest of the site when leaving.
  useEffect(() => {
    document.title = "収録楽曲 | 赤桐ルイ";
    const existing = document.querySelector('meta[name="robots"]');
    const prevContent = existing?.getAttribute("content") ?? null;

    if (existing) {
      existing.setAttribute("content", "noindex");
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      meta.setAttribute("content", "noindex");
      document.head.appendChild(meta);
    }

    return () => {
      document.title = "赤桐ルイ | 作詞家・作曲家・編曲家";
      if (existing) {
        if (prevContent !== null) {
          existing.setAttribute("content", prevContent);
        } else {
          existing.removeAttribute("content");
        }
      } else {
        document.querySelector('meta[name="robots"][content="noindex"]')?.remove();
      }
    };
  }, []);

  const songs = HIGHLIGHT_SONG_IDS
    .map((id) => SONGS.find((s) => s.id === id))
    .filter((s): s is Song => Boolean(s));

  return (
    <main className="min-h-screen pt-24 pb-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Featured video */}
        <FadeIn className="text-center mb-8">
          <SectionLabel>Highlight Reel</SectionLabel>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            3分半でわかる、制作楽曲ダイジェスト
          </h1>
        </FadeIn>

        <FadeIn delay={60} className="mb-16">
          <div className="relative w-full bg-black" style={{ paddingTop: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/cHPqaAiqZWQ?enablejsapi=1"
              title="実績紹介動画"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </FadeIn>

        <FadeIn delay={80} className="text-center mb-10">
          <SectionLabel>Selected Works</SectionLabel>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            収録楽曲
          </h1>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song, i) => (
            <FadeIn key={song.id} delay={i * 70}>
              <SongCard song={song} />
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  );
}

// ─── Works Page ───────────────────────────────────────────────────────────────

function WorksPage() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (typeof window === "undefined") return "All";
    const tag = new URLSearchParams(window.location.search).get("tag");
    return tag && (ALL_TABS as string[]).includes(tag) ? (tag as TabKey) : "All";
  });

  const handleTagClick = (tag: Tag) => {
    setActiveTab(tag);
  };

  const filtered =
    activeTab === "All"
      ? SONGS
      : SONGS.filter((s) => s.tags.includes(activeTab));

  return (
    <main className="min-h-screen pt-32 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-14">
          <SectionLabel>Discography</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Works
          </h1>
        </FadeIn>

        {/* Tab bar */}
        <FadeIn delay={80} className="mb-14">
          <div className="flex items-center justify-center flex-wrap gap-2">
            {ALL_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-xs font-bold tracking-widest border transition-colors ${
                  activeTab === tab
                    ? "bg-[#C41E3A] text-white border-[#C41E3A]"
                    : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grid — 1 col / 2 col / 3-4 col */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((song, i) => (
              <FadeIn key={`${activeTab}-${song.id}`} delay={i * 70}>
                <SongCard song={song} onTagClick={handleTagClick} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-muted-foreground text-sm font-light">
            該当する楽曲が見つかりませんでした。
          </div>
        )}
      </div>
    </main>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState(
    () => window.location.pathname
  );

  const navigate = (path: string) => {
    const cleanPath = path.replace(/\/$/, "") || "/";
    window.history.pushState({}, "", cleanPath);
    setCurrentPage(cleanPath);
    window.scrollTo({ top: 0, behavior: "instant" });

    // GA4's automatic page_view only fires once, on the very first full page
    // load. In-app navigations (clicking Nav/Footer links, etc.) don't trigger
    // a real browser navigation, so without this, GA4 would never see them.
    (window as any).gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: cleanPath,
      page_title: document.title,
    });
  };

  useEffect(() => {
    const onPop = () => setCurrentPage(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const isWorks = currentPage.startsWith("/works");
  const isHighlight = currentPage.startsWith("/highlight");

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
    >
      <Nav currentPage={currentPage} navigate={navigate} />

      {isHighlight ? (
        <HighlightPage />
      ) : isWorks ? (
        <WorksPage />
      ) : (
        <main>
          <HomePage navigate={navigate} />
        </main>
      )}

      <Footer navigate={navigate} />
      <FloatingContactButton forceVisible={isWorks || isHighlight} navigate={navigate} />
    </div>
  );
}
