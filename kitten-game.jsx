import React, { useState, useEffect, useRef, useCallback } from "react";

// ---------- Design tokens ----------
const C = {
  blush: "#FFE9F0",
  cream: "#FFF8F0",
  peach: "#FFC79E",
  peachDark: "#F2A06B",
  mint: "#9FE3C0",
  ink: "#4A3B45",
  berry: "#E5739B",
  sun: "#FFD66B",
  sky: "#DFF1FF",
  card: "#FFFFFF",
};

const FOOD_BASE = 5;
const FOOD_STEP = 2;
const FOOD_CAP = 25;
const foodPrice = (day) => Math.min(FOOD_BASE + (day - 1) * FOOD_STEP, FOOD_CAP);

const HATS = [
  { id: "bow", name: "Ribbon Bow", price: 25, emoji: "🎀" },
  { id: "party", name: "Party Hat", price: 40, emoji: "🥳" },
  { id: "crown", name: "Tiny Crown", price: 80, emoji: "👑" },
];

const DEFAULT_STATE = {
  name: "Mochi",
  coins: 30,
  day: 1,
  streak: 0,
  hunger: 80,
  health: 100,
  fedToday: false,
  ownedHats: [],
  equippedHat: null,
  ranAway: false,
  callsMade: 0,
  bestStreak: 0,
};

// ---------- Cat SVG ----------
function Cat({ mood, hat, bobbing }) {
  const earDroop = mood === "hungry" || mood === "sick" ? 14 : 0;
  const eyes = (() => {
    switch (mood) {
      case "happy":
        return (
          <g>
            <circle cx="78" cy="78" r="9" fill={C.ink} />
            <circle cx="122" cy="78" r="9" fill={C.ink} />
            <circle cx="81" cy="74" r="3.2" fill="#fff" />
            <circle cx="125" cy="74" r="3.2" fill="#fff" />
            <circle cx="76" cy="81" r="1.6" fill="#fff" opacity="0.8" />
            <circle cx="120" cy="81" r="1.6" fill="#fff" opacity="0.8" />
          </g>
        );
      case "joy":
        return (
          <g stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M70 78 Q78 70 86 78" />
            <path d="M114 78 Q122 70 130 78" />
          </g>
        );
      case "hungry":
        return (
          <g>
            <circle cx="78" cy="79" r="10.5" fill={C.ink} />
            <circle cx="122" cy="79" r="10.5" fill={C.ink} />
            <circle cx="81" cy="74" r="4" fill="#fff" />
            <circle cx="125" cy="74" r="4" fill="#fff" />
            <circle cx="74" cy="83" r="2" fill="#fff" opacity="0.9" />
            <circle cx="118" cy="83" r="2" fill="#fff" opacity="0.9" />
            <path d="M88 92 q2 5 -1 8" stroke="#9CCDF0" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        );
      case "sick":
        return (
          <g stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M71 76 L85 82 M85 76 L71 82" />
            <path d="M115 76 L129 82 M129 76 L115 82" />
          </g>
        );
      default:
        return null;
    }
  })();

  const mouth = (() => {
    switch (mood) {
      case "happy":
      case "joy":
        return (
          <g stroke={C.ink} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M93 96 Q100 103 107 96" />
          </g>
        );
      case "hungry":
        return (
          <g stroke={C.ink} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M94 101 Q100 96 106 101" />
          </g>
        );
      case "sick":
        return (
          <g stroke={C.ink} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M93 100 Q97 97 100 100 Q103 103 107 100" />
          </g>
        );
      default:
        return null;
    }
  })();

  const hatSvg = (() => {
    switch (hat) {
      case "bow":
        return (
          <g transform="translate(128,34) rotate(18)">
            <path d="M0 0 L-16 -9 L-16 9 Z" fill={C.berry} />
            <path d="M0 0 L16 -9 L16 9 Z" fill={C.berry} />
            <circle cx="0" cy="0" r="5" fill="#C9527E" />
          </g>
        );
      case "party":
        return (
          <g transform="translate(100,18)">
            <path d="M0 22 L-16 22 L0 -14 L16 22 Z" fill={C.sun} transform="rotate(-8)" />
            <path d="M-16 22 L0 -14 L16 22" fill="none" stroke="#E8B83E" strokeWidth="2" transform="rotate(-8)" />
            <circle cx="-2" cy="-15" r="5" fill={C.berry} />
          </g>
        );
      case "crown":
        return (
          <g transform="translate(100,24)">
            <path d="M-18 12 L-18 -6 L-9 2 L0 -12 L9 2 L18 -6 L18 12 Z" fill={C.sun} stroke="#E8B83E" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="0" cy="-12" r="3" fill={C.berry} />
          </g>
        );
      default:
        return null;
    }
  })();

  return (
    <svg
      viewBox="0 0 200 190"
      style={{
        width: "100%",
        maxWidth: 230,
        animation: bobbing ? "bob 2.6s ease-in-out infinite" : "none",
        filter: mood === "sick" ? "saturate(0.6)" : "none",
        transition: "filter 0.6s",
      }}
    >
      {/* tail */}
      <path
        d="M158 150 Q186 142 180 114"
        stroke={C.peach}
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "158px 150px", animation: "tail 3s ease-in-out infinite" }}
      />
      {/* body */}
      <ellipse cx="100" cy="148" rx="52" ry="36" fill={C.peach} />
      <ellipse cx="100" cy="156" rx="26" ry="20" fill={C.cream} />
      {/* paws */}
      <ellipse cx="74" cy="178" rx="13" ry="8" fill={C.peach} />
      <ellipse cx="126" cy="178" rx="13" ry="8" fill={C.peach} />
      {/* ears */}
      <g transform={`rotate(${-earDroop} 62 42)`}>
        <path d="M52 58 L62 22 L84 46 Z" fill={C.peach} />
        <path d="M59 50 L64 33 L75 45 Z" fill="#FFE0EA" />
      </g>
      <g transform={`rotate(${earDroop} 138 42)`}>
        <path d="M148 58 L138 22 L116 46 Z" fill={C.peach} />
        <path d="M141 50 L136 33 L125 45 Z" fill="#FFE0EA" />
      </g>
      {/* head */}
      <circle cx="100" cy="78" r="46" fill={C.peach} />
      <ellipse cx="100" cy="92" rx="30" ry="20" fill={C.cream} />
      {/* fur tufts */}
      <path d="M88 34 q4 -8 8 0 q4 -8 8 0" stroke={C.peachDark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* blush */}
      <ellipse cx="66" cy="92" rx="7.5" ry="5" fill="#FFB3C7" opacity="0.85" />
      <ellipse cx="134" cy="92" rx="7.5" ry="5" fill="#FFB3C7" opacity="0.85" />
      {eyes}
      {/* nose */}
      <path d="M96 89 L104 89 L100 94 Z" fill={C.berry} />
      {mouth}
      {/* whiskers */}
      <g stroke={C.peachDark} strokeWidth="2" strokeLinecap="round" opacity="0.8">
        <path d="M52 86 L34 82" />
        <path d="M52 93 L34 95" />
        <path d="M148 86 L166 82" />
        <path d="M148 93 L166 95" />
      </g>
      {hatSvg}
      {mood === "sick" && (
        <g>
          <rect x="128" y="58" width="22" height="7" rx="3.5" fill="#fff" stroke="#D8CDD2" transform="rotate(28 128 58)" />
          <rect x="128" y="58" width="8" height="7" rx="3.5" fill={C.berry} transform="rotate(28 128 58)" />
        </g>
      )}
    </svg>
  );
}

// ---------- Small UI pieces ----------
function StatBar({ label, value, color, icon }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 4 }}>
        <span>{icon} {label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div style={{ height: 12, background: "#F1E4E9", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(0, Math.min(100, value))}%`,
            background: color,
            borderRadius: 999,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      key={toast.id}
      style={{
        position: "absolute",
        top: 14,
        left: "50%",
        transform: "translateX(-50%)",
        background: C.ink,
        color: "#fff",
        padding: "8px 16px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: "nowrap",
        animation: "toastIn 0.3s ease",
        zIndex: 30,
        boxShadow: "0 6px 18px rgba(74,59,69,0.25)",
      }}
    >
      {toast.text}
    </div>
  );
}

// ---------- Main app ----------
export default function KittenGame() {
  const [s, setS] = useState(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const [toast, setToast] = useState(null);
  const [yarn, setYarn] = useState(null);
  const [tab, setTab] = useState("care");
  const [joyUntil, setJoyUntil] = useState(0);
  const petCooldown = useRef(0);
  const yarnTimer = useRef(null);
  const toastTimer = useRef(null);

  // ----- load / save -----
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("kitten-game-v1");
        if (res && res.value) setS({ ...DEFAULT_STATE, ...JSON.parse(res.value) });
      } catch (e) {
        /* fresh start */
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      try {
        window.storage.set("kitten-game-v1", JSON.stringify(s));
      } catch (e) {
        /* in-memory only */
      }
    }, 600);
    return () => clearTimeout(t);
  }, [s, loaded]);

  // ----- hunger / health tick (demo speed: fast) -----
  useEffect(() => {
    if (!loaded) return;
    const iv = setInterval(() => {
      setS((p) => {
        if (p.ranAway) return p;
        let hunger = Math.max(0, p.hunger - 1);
        let health = p.health;
        if (hunger === 0) health = Math.max(0, health - 2);
        else if (hunger > 60 && health < 100) health = Math.min(100, health + 0.5);
        const ranAway = health === 0;
        return { ...p, hunger, health, ranAway, callsMade: ranAway ? 0 : p.callsMade };
      });
    }, 1500);
    return () => clearInterval(iv);
  }, [loaded]);

  // ----- helpers -----
  const showToast = useCallback((text) => {
    clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text });
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const burstConfetti = useCallback(() => {
    const pieces = Array.from({ length: 26 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      color: [C.berry, C.sun, C.mint, C.peach, "#9CCDF0"][i % 5],
      rot: Math.random() * 360,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 2400);
  }, []);

  const spawnHearts = useCallback((n) => {
    const hs = Array.from({ length: n }, (_, i) => ({
      id: Date.now() + i,
      left: 35 + Math.random() * 30,
      delay: i * 0.12,
    }));
    setHearts((prev) => [...prev, ...hs]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => !hs.includes(h))), 1600);
  }, []);

  // ----- derived -----
  const mood = s.ranAway
    ? "gone"
    : Date.now() < joyUntil
    ? "joy"
    : s.health <= 35
    ? "sick"
    : s.hunger <= 35
    ? "hungry"
    : "happy";

  const price = foodPrice(s.day);

  // ----- actions -----
  const pet = () => {
    if (s.ranAway) return;
    const now = Date.now();
    if (now - petCooldown.current < 1200) return;
    petCooldown.current = now;
    spawnHearts(3);
    setJoyUntil(now + 1300);
    const roll = Math.random();
    if (roll < 0.12) {
      setS((p) => ({ ...p, coins: p.coins + 5 }));
      showToast(`✨ ${s.name} purrs! +5 coins`);
    } else if (roll < 0.55) {
      setS((p) => ({ ...p, coins: p.coins + 1 }));
      showToast("💛 +1 coin");
    }
  };

  const feed = () => {
    if (s.ranAway || s.coins < price || s.hunger >= 100) return;
    setS((p) => ({
      ...p,
      coins: p.coins - price,
      hunger: Math.min(100, p.hunger + 45),
      health: Math.min(100, p.health + 10),
      fedToday: true,
    }));
    setJoyUntil(Date.now() + 1600);
    spawnHearts(4);
    if (Math.random() < 0.25) {
      const bonus = 4 + Math.floor(Math.random() * 7);
      setS((p) => ({ ...p, coins: p.coins + bonus }));
      showToast(`🎁 ${s.name} found a gift! +${bonus} coins`);
      burstConfetti();
    } else {
      showToast(`😋 Yum! ${s.name} is fed`);
    }
  };

  const playYarn = () => {
    if (s.ranAway || yarn) return;
    const x = 12 + Math.random() * 70;
    const y = 18 + Math.random() * 45;
    setYarn({ x, y, id: Date.now() });
    showToast("🧶 Quick! Tap the yarn!");
    yarnTimer.current = setTimeout(() => {
      setYarn(null);
      showToast("The yarn rolled away…");
    }, 2600);
  };

  const catchYarn = () => {
    clearTimeout(yarnTimer.current);
    setYarn(null);
    setS((p) => ({ ...p, coins: p.coins + 8 }));
    setJoyUntil(Date.now() + 1600);
    spawnHearts(2);
    showToast("🧶 Caught it! +8 coins");
  };

  const nextDay = () => {
    if (s.ranAway) return;
    setS((p) => {
      const keptStreak = p.fedToday;
      const streak = keptStreak ? p.streak + 1 : 0;
      const milestone = keptStreak && (streak === 3 || streak === 7 || streak % 10 === 0);
      if (milestone) burstConfetti();
      showToast(
        keptStreak
          ? `🌅 Day ${p.day + 1}! Streak ${streak} · +10 coins`
          : `🌅 Day ${p.day + 1}. ${p.name} missed dinner — streak reset`
      );
      return {
        ...p,
        day: p.day + 1,
        streak,
        bestStreak: Math.max(p.bestStreak, streak),
        coins: p.coins + 10,
        fedToday: false,
        hunger: Math.max(15, p.hunger - 20),
      };
    });
  };

  const callCat = () => {
    setS((p) => {
      const calls = p.callsMade + 1;
      if (calls >= 3) {
        showToast(`💖 ${p.name} came home!`);
        return { ...p, ranAway: false, callsMade: 0, health: 35, hunger: 40 };
      }
      showToast(calls === 1 ? "You hear a faint meow…" : "Pawsteps! Keep calling!");
      return { ...p, callsMade: calls };
    });
  };

  const buyHat = (hat) => {
    if (s.ownedHats.includes(hat.id)) {
      setS((p) => ({ ...p, equippedHat: p.equippedHat === hat.id ? null : hat.id }));
      return;
    }
    if (s.coins < hat.price) {
      showToast("Not enough coins yet — play with " + s.name + "!");
      return;
    }
    setS((p) => ({
      ...p,
      coins: p.coins - hat.price,
      ownedHats: [...p.ownedHats, hat.id],
      equippedHat: hat.id,
    }));
    burstConfetti();
    showToast(`${hat.emoji} ${s.name} loves the ${hat.name}!`);
  };

  const reset = () => {
    setS(DEFAULT_STATE);
    try {
      window.storage.delete("kitten-game-v1");
    } catch (e) {}
    showToast("Fresh start! 🐣");
  };

  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: C.blush, fontFamily: "'Baloo 2', 'Quicksand', system-ui, sans-serif", color: C.ink, fontWeight: 700 }}>
        Waking up the kitten…
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${C.blush} 0%, ${C.cream} 100%)`,
        display: "flex",
        justifyContent: "center",
        padding: "16px 12px 32px",
        fontFamily: "'Baloo 2', 'Quicksand', system-ui, sans-serif",
        color: C.ink,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Quicksand:wght@500;700&display=swap');
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes tail { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(9deg); } }
        @keyframes heartUp { 0% { transform: translateY(0) scale(0.6); opacity: 0; } 15% { opacity: 1; } 100% { transform: translateY(-90px) scale(1.15); opacity: 0; } }
        @keyframes confettiFall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(340px) rotate(540deg); opacity: 0; } }
        @keyframes toastIn { from { transform: translate(-50%, -8px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes yarnPop { from { transform: scale(0); } to { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        button { font-family: inherit; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{s.name}</div>
            <div style={{ fontSize: 13, opacity: 0.7, fontWeight: 700 }}>
              Day {s.day} · 🔥 Streak {s.streak}
              {s.bestStreak > 0 ? ` · Best ${s.bestStreak}` : ""}
            </div>
          </div>
          <div
            style={{
              background: C.card,
              borderRadius: 999,
              padding: "8px 14px",
              fontWeight: 800,
              fontSize: 16,
              boxShadow: "0 3px 10px rgba(74,59,69,0.08)",
            }}
          >
            🪙 {s.coins}
          </div>
        </div>

        {/* Scene */}
        <div
          style={{
            position: "relative",
            background: `linear-gradient(180deg, ${C.sky} 0%, #FDF3E7 78%, #F6E3D2 78%, #F6E3D2 100%)`,
            borderRadius: 28,
            padding: "26px 16px 12px",
            boxShadow: "0 10px 30px rgba(74,59,69,0.10)",
            overflow: "hidden",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Toast toast={toast} />

          {/* sun + clouds */}
          <div style={{ position: "absolute", top: 18, right: 22, width: 38, height: 38, borderRadius: "50%", background: C.sun, opacity: 0.9 }} />
          <div style={{ position: "absolute", top: 30, left: 20, width: 54, height: 18, borderRadius: 999, background: "#fff", opacity: 0.85 }} />
          <div style={{ position: "absolute", top: 56, left: 56, width: 38, height: 14, borderRadius: 999, background: "#fff", opacity: 0.7 }} />

          {/* confetti */}
          {confetti.map((p) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                top: 0,
                left: `${p.left}%`,
                width: 8,
                height: 8,
                borderRadius: 2,
                background: p.color,
                transform: `rotate(${p.rot}deg)`,
                animation: `confettiFall 2.1s ${p.delay}s ease-in forwards`,
                zIndex: 20,
              }}
            />
          ))}

          {/* hearts */}
          {hearts.map((h) => (
            <div
              key={h.id}
              style={{
                position: "absolute",
                bottom: 130,
                left: `${h.left}%`,
                fontSize: 22,
                animation: `heartUp 1.5s ${h.delay}s ease-out forwards`,
                zIndex: 15,
                pointerEvents: "none",
              }}
            >
              💗
            </div>
          ))}

          {/* yarn minigame target */}
          {yarn && (
            <button
              onClick={catchYarn}
              style={{
                position: "absolute",
                left: `${yarn.x}%`,
                top: `${yarn.y}%`,
                fontSize: 34,
                background: "none",
                border: "none",
                cursor: "pointer",
                animation: "yarnPop 0.25s ease",
                zIndex: 25,
              }}
              aria-label="Catch the yarn"
            >
              🧶
            </button>
          )}

          {/* the cat (or empty room) */}
          {s.ranAway ? (
            <div style={{ textAlign: "center", paddingBottom: 30 }}>
              <div style={{ fontSize: 52 }}>🌙</div>
              <div style={{ fontWeight: 800, fontSize: 18, marginTop: 6 }}>{s.name} ran away…</div>
              <div style={{ fontSize: 13, opacity: 0.75, maxWidth: 240, margin: "6px auto 14px" }}>
                Too many hungry days. Call gently and {s.name} will come home.
              </div>
              <button
                onClick={callCat}
                style={{
                  background: C.berry,
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "12px 26px",
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 6px 16px rgba(229,115,155,0.4)",
                }}
              >
                📣 Call {s.name} ({s.callsMade}/3)
              </button>
            </div>
          ) : (
            <button
              onClick={pet}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "block", width: "60%" }}
              aria-label={`Pet ${s.name}`}
            >
              <Cat mood={mood} hat={s.equippedHat} bobbing={mood !== "sick"} />
            </button>
          )}

          {!s.ranAway && (
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.55, paddingBottom: 4 }}>
              tap {s.name} to pet · sometimes you find coins
            </div>
          )}
        </div>

        {/* Stat bars */}
        <div style={{ display: "flex", gap: 14, background: C.card, borderRadius: 20, padding: "14px 16px", margin: "12px 0", boxShadow: "0 4px 14px rgba(74,59,69,0.06)" }}>
          <StatBar label="Tummy" value={s.hunger} color={`linear-gradient(90deg, ${C.sun}, ${C.peachDark})`} icon="🍣" />
          <StatBar label="Health" value={s.health} color={`linear-gradient(90deg, ${C.mint}, #5CC79A)`} icon="💚" />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[
            ["care", "🍱 Care"],
            ["shop", "🛍️ Shop"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                border: "none",
                borderRadius: 999,
                padding: "10px 0",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                background: tab === id ? C.ink : C.card,
                color: tab === id ? "#fff" : C.ink,
                boxShadow: "0 3px 10px rgba(74,59,69,0.07)",
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "care" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={feed}
                disabled={s.ranAway || s.coins < price || s.hunger >= 100}
                style={{
                  flex: 1.4,
                  border: "none",
                  borderRadius: 18,
                  padding: "16px 10px",
                  fontWeight: 800,
                  fontSize: 16,
                  cursor: "pointer",
                  background: s.coins >= price && !s.ranAway && s.hunger < 100 ? C.berry : "#E9D8DF",
                  color: s.coins >= price && !s.ranAway && s.hunger < 100 ? "#fff" : "#A98E9B",
                  boxShadow: s.coins >= price ? "0 6px 16px rgba(229,115,155,0.35)" : "none",
                  transition: "all 0.2s",
                }}
              >
                🍣 Feed · 🪙 {price}
              </button>
              <button
                onClick={playYarn}
                disabled={s.ranAway || !!yarn}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 18,
                  padding: "16px 10px",
                  fontWeight: 800,
                  fontSize: 16,
                  cursor: "pointer",
                  background: C.mint,
                  color: "#2E6B4F",
                  boxShadow: "0 6px 16px rgba(159,227,192,0.5)",
                }}
              >
                🧶 Play
              </button>
            </div>
            <button
              onClick={nextDay}
              disabled={s.ranAway}
              style={{
                border: "2px dashed #E3CBD6",
                borderRadius: 18,
                padding: "13px 10px",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                background: "transparent",
                color: C.ink,
                opacity: 0.85,
              }}
            >
              🌙 Sleep → Next Day {s.fedToday ? "(streak safe ✓)" : "(not fed yet!)"}
            </button>
            <div style={{ fontSize: 12, textAlign: "center", opacity: 0.6, fontWeight: 700 }}>
              Food costs rise each day (🪙{FOOD_BASE} → cap 🪙{FOOD_CAP}) — earn coins by petting & playing
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {HATS.map((h) => {
              const owned = s.ownedHats.includes(h.id);
              const equipped = s.equippedHat === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => buyHat(h)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: equipped ? `2.5px solid ${C.berry}` : "2.5px solid transparent",
                    borderRadius: 18,
                    padding: "14px 16px",
                    background: C.card,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(74,59,69,0.06)",
                    fontWeight: 800,
                    fontSize: 15,
                    color: C.ink,
                  }}
                >
                  <span>
                    {h.emoji} {h.name}
                  </span>
                  <span style={{ color: owned ? C.berry : C.ink, fontSize: 13 }}>
                    {equipped ? "Wearing ✓" : owned ? "Put on" : `🪙 ${h.price}`}
                  </span>
                </button>
              );
            })}
            <div style={{ fontSize: 12, textAlign: "center", opacity: 0.6, fontWeight: 700 }}>
              Cosmetics are the monetization layer — feeding is always earnable for free
            </div>
          </div>
        )}

        {/* footer */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <button
            onClick={reset}
            style={{ background: "none", border: "none", color: C.ink, opacity: 0.45, fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
          >
            Reset prototype
          </button>
        </div>
      </div>
    </div>
  );
}
