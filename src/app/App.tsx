import { useState, useEffect, useRef } from "react";
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

interface Song {
  id: string;
  title: string;
  client: string;
  genre: string;
  genreFilters: GenreTab[];
  youtubeId: string;
  badge?: string;
}

type GenreTab = "All" | "J-POP" | "ロック" | "VTuber" | "アイドル";
const ALL_TABS: GenreTab[] = ["All", "J-POP", "ロック", "VTuber", "アイドル"];

// ─── Data ────────────────────────────────────────────────────────────────────

const SONGS: Song[] = [
  {
    id: "1",
    title: "かまちょ注意報!",
    client: "自身名義 (feat.椎乃実夏)",
    genre: "VTuber",
    genreFilters: ["VTuber", "J-POP"],
    youtubeId: "9VmBqG2qOiY",
    badge: "UGC 3,600件突破・累計120万再生",
  },
  {
    id: "2",
    title: "僕ら色の銀河",
    client: "友絆リュリュ",
    genre: "VTuber",
    genreFilters: ["VTuber"],
    youtubeId: "I5MdhNn3AcQ",
    badge: "再生回数5万回突破",
  },
  {
    id: "3",
    title: "君がいるだけでフルコンボ",
    client: "南花音",
    genre: "アイドル",
    genreFilters: ["アイドル", "J-POP"],
    youtubeId: "oTuvE_5jqdw",
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

function SongCard({ song }: { song: Song }) {
  return (
    <article className="flex flex-col bg-card border border-border overflow-hidden group transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      {/* 16:9 YouTube embed */}
      <div className="relative w-full bg-muted" style={{ paddingTop: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${song.youtubeId}`}
          title={song.title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        {song.badge && (
          <span className="self-start text-[10px] font-bold tracking-wider text-[#C41E3A] border border-[#C41E3A] px-2 py-0.5 leading-tight">
            {song.badge}
          </span>
        )}
        <div>
          <h3 className="text-base font-bold text-foreground leading-snug mb-1">
            {song.title}
          </h3>
          <p className="text-xs font-light text-muted-foreground">{song.client}</p>
        </div>
        <span className="self-start text-[10px] font-medium bg-secondary text-muted-foreground px-2 py-0.5 tracking-wide">
          {song.genre}
        </span>
      </div>
    </article>
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
    const IDLE_MS = 1600;

    const rippleOptions = { 
      resolution: 384,
      dropRadius: 30,
      perturbance: 0.03,
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
          to   { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden">
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

      {/* Scroll arrow */}
      <button
        onClick={() =>
          document.getElementById("profile")?.scrollIntoView({ behavior: "smooth" })
        }
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-[#C41E3A] transition-colors"
        style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
        aria-label="Scroll down"
      >
        <span className="text-[9px] tracking-[0.3em] font-bold">SCROLL</span>
        <ChevronDown size={16} />
      </button>

      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
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
        <FadeIn className="flex flex-col md:flex-row items-center md:items-center gap-12 md:gap-16">
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
  return (
    <section className="py-32 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
          <SectionLabel>Works</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            楽曲抜粋
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {SONGS.map((song, i) => (
            <FadeIn key={song.id} delay={i * 100}>
              <SongCard song={song} />
            </FadeIn>
          ))}
        </div>

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: replace action with Formspree endpoint
    const form = e.currentTarget;
    const data = new FormData(form);
    fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then((r) => {
        if (r.ok) {
          setSubmitted(true);
          form.reset();
        }
      })
      .catch(() => {
        // Silently fail for placeholder — user will wire Formspree
        setSubmitted(true);
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
                className="w-full bg-[#C41E3A] text-white py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#a5192f] transition-colors mt-1"
              >
                送信する
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
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

// ─── Works Page ───────────────────────────────────────────────────────────────

function WorksPage() {
  const [activeTab, setActiveTab] = useState<GenreTab>("All");

  const filtered =
    activeTab === "All"
      ? SONGS
      : SONGS.filter((s) => s.genreFilters.includes(activeTab));

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((song, i) => (
              <FadeIn key={`${activeTab}-${song.id}`} delay={i * 70}>
                <SongCard song={song} />
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
  };

  useEffect(() => {
    const onPop = () => setCurrentPage(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const isWorks = currentPage === "/works";

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
    >
      <Nav currentPage={currentPage} navigate={navigate} />

      {isWorks ? (
        <WorksPage />
      ) : (
        <main>
          <HomePage navigate={navigate} />
        </main>
      )}

      <Footer navigate={navigate} />
    </div>
  );
}
