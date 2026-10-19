// Syukur Quest: gamified gratitude journal. All data lives in localStorage.

const STORAGE_KEY = "syukur-quest-v1";

const CATEGORIES = [
  { id: "orang", label: "👨‍👩‍👧 Orang tersayang" },
  { id: "alam", label: "🌿 Alam" },
  { id: "kerja", label: "📚 Kerja / Belajar" },
  { id: "sihat", label: "💪 Kesihatan" },
  { id: "kecil", label: "🍜 Benda kecil" },
  { id: "diri", label: "🪞 Diri sendiri" },
];

const LEVEL_NAMES = [
  "Benih", "Tunas", "Anak Pokok", "Pokok Rendang", "Taman Syukur",
  "Hutan Hijau", "Gunung Tenang", "Bintang Syukur", "Lagenda Syukur",
];

// Each fact is a real, published finding. `stat` links it to a game stat.
const FACTS = [
  {
    stat: "optimis",
    text: "Peserta yang menulis 5 perkara yang mereka syukuri setiap minggu selama 10 minggu rasa lebih optimis tentang hidup berbanding kumpulan yang menulis tentang masalah harian.",
    cite: "Emmons & McCullough (2003), Journal of Personality and Social Psychology",
  },
  {
    stat: "badan",
    text: "Dalam kajian yang sama, kumpulan syukur melaporkan kurang simptom fizikal dan bersenam kira-kira 1.5 jam lebih seminggu.",
    cite: "Emmons & McCullough (2003), Journal of Personality and Social Psychology",
  },
  {
    stat: "minda",
    text: "Menulis 3 perkara baik setiap malam selama seminggu meningkatkan rasa bahagia dan mengurangkan simptom kemurungan, dengan kesan yang masih dikesan selepas 6 bulan.",
    cite: "Seligman, Steen, Park & Peterson (2005), American Psychologist",
  },
  {
    stat: "hubungan",
    text: "Menulis dan menyampaikan surat terima kasih kepada seseorang memberi lonjakan bahagia yang paling besar dalam kajian, berlanjutan sehingga sebulan.",
    cite: "Seligman et al. (2005), American Psychologist",
  },
  {
    stat: "tidur",
    text: "Orang yang lebih bersyukur cenderung tidur lebih cepat, lebih lama dan lebih lena, sebahagiannya kerana fikiran sebelum tidur lebih positif.",
    cite: "Wood, Joseph, Lloyd & Atkins (2009), Journal of Psychosomatic Research",
  },
  {
    stat: "minda",
    text: "Klien kaunseling yang menulis surat terima kasih melaporkan kesihatan mental yang lebih baik 4 dan 12 minggu kemudian berbanding yang tidak.",
    cite: "Wong et al. (2018), Psychotherapy Research",
  },
  {
    stat: "hubungan",
    text: "Kita selalu memandang rendah betapa gembiranya orang bila menerima ucapan terima kasih. Penerima rasa lebih gembira dan kurang janggal daripada yang dijangka oleh pengirim.",
    cite: "Kumar & Epley (2018), Psychological Science",
  },
  {
    stat: "hubungan",
    text: "Bila kita ucap terima kasih kepada kenalan baru, mereka lebih cenderung mahu terus berhubung dengan kita.",
    cite: "Williams & Bartlett (2015), Emotion",
  },
  {
    stat: "hubungan",
    text: "Teori 'find, remind & bind': rasa syukur membantu kita mengenal pasti, mengingati dan mengeratkan hubungan dengan orang yang baik dengan kita.",
    cite: "Algoe, Haidt & Gable (2008), Emotion; Algoe (2012)",
  },
  {
    stat: "minda",
    text: "Rasa syukur membantu kesabaran. Orang yang sedang rasa bersyukur lebih sanggup menunggu ganjaran yang lebih besar berbanding mengambil ganjaran kecil serta-merta.",
    cite: "DeSteno, Li, Dickens & Lerner (2014), Psychological Science",
  },
  {
    stat: "badan",
    text: "Dalam satu kajian kecil, pesakit jantung yang menulis jurnal syukur selama 8 minggu menunjukkan penanda inflamasi yang lebih rendah.",
    cite: "Redwine et al. (2016), Psychosomatic Medicine (kajian rintis)",
  },
  {
    stat: "optimis",
    text: "Analisis gabungan banyak kajian mendapati latihan syukur hanya memberi kesan kecil terhadap kebimbangan dan kemurungan. Ia membantu, tetapi bukan pengganti rawatan.",
    cite: "Cregg & Cheavens (2021), Journal of Happiness Studies",
  },
];

const STATS = [
  { id: "minda", icon: "🧠", name: "Minda Tenang", desc: "Kurang stres, lebih bahagia" },
  { id: "optimis", icon: "☀️", name: "Optimisme", desc: "Pandangan hidup lebih positif" },
  { id: "hubungan", icon: "❤️", name: "Hubungan", desc: "Ikatan dengan orang lain" },
  { id: "tidur", icon: "😴", name: "Kualiti Tidur", desc: "Fikiran tenang sebelum tidur" },
  { id: "badan", icon: "💪", name: "Badan Aktif", desc: "Kurang sakit, lebih bersenam" },
];
const STAT_STEP = 20; // points per stat level

const BADGES = [
  { id: "first", icon: "🌱", name: "Langkah Pertama", test: (s) => s.total >= 1 },
  { id: "thanks1", icon: "💌", name: "Ucapan Pertama", test: (s) => s.thanks >= 1 },
  { id: "streak3", icon: "🔥", name: "3 Hari Berturut", test: (s) => s.bestStreak >= 3 },
  { id: "streak7", icon: "🏅", name: "Seminggu Penuh", test: (s) => s.bestStreak >= 7 },
  { id: "ten", icon: "📖", name: "10 Catatan", test: (s) => s.total >= 10 },
  { id: "night", icon: "🌙", name: "Burung Hantu Syukur", test: (s) => s.night >= 5 },
  { id: "detail", icon: "✍️", name: "Penulis Detail", test: (s) => s.long >= 5 },
  { id: "thanks10", icon: "🤝", name: "Raja Terima Kasih", test: (s) => s.thanks >= 10 },
  { id: "rainbow", icon: "🌈", name: "Syukur Pelangi", test: (s) => s.cats.size >= CATEGORIES.length },
  { id: "fifty", icon: "🌳", name: "50 Catatan", test: (s) => s.total >= 50 },
];

const PROMPTS = [
  "Siapa yang buat hari awak lebih senang minggu ni?",
  "Apa makanan sedap yang awak makan baru-baru ni?",
  "Apa satu benda pada badan awak yang awak bersyukur masih berfungsi dengan baik?",
  "Siapa cikgu atau mentor yang banyak bantu awak?",
  "Apa bunyi, bau atau pemandangan yang buat awak tenang hari ni?",
  "Apa satu kemahiran yang awak ada sekarang yang dulu awak tak ada?",
  "Siapa yang awak belum sempat ucap terima kasih?",
  "Apa benda kecil yang selalu kita ambil mudah, tapi sebenarnya nikmat?",
  "Apa satu cabaran yang akhirnya mengajar awak sesuatu?",
  "Apa yang awak suka tentang rumah atau bilik awak?",
];

// ---------- state ----------

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && Array.isArray(data.entries)) return data;
  } catch (e) { /* storage unavailable or corrupt */ }
  return { entries: [] };
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

let state = load();
let entryType = "journal";
let selectedCats = new Set();

// ---------- helpers ----------

const $ = (id) => document.getElementById(id);

function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isNight(ts) {
  const h = new Date(ts).getHours();
  return h >= 18 || h < 4;
}

function levelFromXp(xp) {
  // Level n -> n+1 costs 50 * n XP.
  let level = 1, need = 50, rest = xp;
  while (rest >= need) { rest -= need; level++; need = 50 * level; }
  return { level, into: rest, need };
}

function statGains(entry) {
  const g = { minda: 3, optimis: 3, hubungan: 0, tidur: 1, badan: 1 };
  if (entry.type === "thanks") g.hubungan += 6;
  if (entry.cats.includes("orang")) g.hubungan += 3;
  if (entry.cats.includes("diri")) g.minda += 2;
  if (entry.cats.includes("kerja") || entry.cats.includes("alam")) g.optimis += 2;
  if (entry.cats.includes("sihat")) g.badan += 4;
  if (isNight(entry.ts)) g.tidur += 4;
  return g;
}

function computeStreaks(entries) {
  const days = new Set(entries.map((e) => dayKey(e.ts)));
  const sorted = [...days].sort();
  let best = 0, run = 0, prev = null;
  for (const k of sorted) {
    const d = new Date(k + "T00:00:00");
    run = prev && (d - prev) / 86400000 === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  // Current streak counts back from today (or yesterday, so it doesn't break before you write today).
  let cur = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(dayKey(cursor))) { cur++; cursor.setDate(cursor.getDate() - 1); }
  return { current: cur, best };
}

function summarize() {
  const s = {
    xp: 0, total: state.entries.length, thanks: 0, night: 0, long: 0,
    cats: new Set(), stats: Object.fromEntries(STATS.map((x) => [x.id, 0])),
  };
  for (const e of state.entries) {
    s.xp += e.xp;
    if (e.type === "thanks") s.thanks++;
    if (isNight(e.ts)) s.night++;
    if (e.text.length >= 100) s.long++;
    e.cats.forEach((c) => s.cats.add(c));
    const g = statGains(e);
    for (const k in g) s.stats[k] += g[k];
  }
  const st = computeStreaks(state.entries);
  s.streak = st.current;
  s.bestStreak = st.best;
  s.badges = BADGES.filter((b) => b.test(s)).map((b) => b.id);
  return s;
}

// ---------- render ----------

function renderChips() {
  const wrap = $("categoryChips");
  wrap.innerHTML = "";
  for (const c of CATEGORIES) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (selectedCats.has(c.id) ? " on" : "");
    b.textContent = c.label;
    b.onclick = () => {
      selectedCats.has(c.id) ? selectedCats.delete(c.id) : selectedCats.add(c.id);
      renderChips();
    };
    wrap.appendChild(b);
  }
}

function render() {
  const s = summarize();
  const lv = levelFromXp(s.xp);
  $("levelNum").textContent = lv.level;
  $("levelName").textContent = LEVEL_NAMES[Math.min(lv.level - 1, LEVEL_NAMES.length - 1)];
  $("xpText").textContent = `${lv.into} / ${lv.need} XP`;
  $("xpFill").style.width = `${(lv.into / lv.need) * 100}%`;
  $("streak").textContent = s.streak;

  $("stats").innerHTML = "";
  for (const st of STATS) {
    const pts = s.stats[st.id];
    const el = document.createElement("div");
    el.className = "stat";
    el.innerHTML = `
      <div class="stat-top"><b>${st.icon} ${st.name}</b><span class="stat-lvl">Lv ${Math.floor(pts / STAT_STEP) + 1}</span></div>
      <div class="bar"><div style="width:${((pts % STAT_STEP) / STAT_STEP) * 100}%"></div></div>
      <p>${st.desc}</p>`;
    $("stats").appendChild(el);
  }

  $("badges").innerHTML = "";
  for (const b of BADGES) {
    const el = document.createElement("div");
    el.className = "badge" + (s.badges.includes(b.id) ? " got" : "");
    el.innerHTML = `<span class="ico">${b.icon}</span>${b.name}`;
    $("badges").appendChild(el);
  }

  // Last 7 days strip
  const days = new Set(state.entries.map((e) => dayKey(e.ts)));
  const names = ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"];
  $("week").innerHTML = "";
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const done = days.has(dayKey(d));
    const el = document.createElement("div");
    el.className = "day" + (done ? " done" : "");
    el.innerHTML = `${names[d.getDay()]}<div class="dot">${done ? "✓" : ""}</div>`;
    $("week").appendChild(el);
  }

  $("countText").textContent = `${s.total} catatan`;
  $("empty").classList.toggle("hidden", s.total > 0);
  const log = $("log");
  log.innerHTML = "";
  for (const e of [...state.entries].reverse()) {
    const li = document.createElement("li");
    const meta = document.createElement("div");
    meta.className = "meta";
    const when = new Date(e.ts).toLocaleString("ms-MY", { dateStyle: "medium", timeStyle: "short" });
    const label = e.type === "thanks" ? `💌 Untuk ${e.to || "seseorang"}` : "🙏 Syukur";
    const left = document.createElement("span");
    left.textContent = `${label} · ${when} · +${e.xp} XP`;
    const del = document.createElement("button");
    del.className = "del";
    del.title = "Padam";
    del.textContent = "✕";
    del.onclick = () => {
      if (!confirm("Padam catatan ini?")) return;
      state.entries = state.entries.filter((x) => x.id !== e.id);
      save();
      render();
    };
    meta.append(left, del);
    const p = document.createElement("p");
    p.className = "text";
    p.textContent = e.text;
    li.append(meta, p);
    log.appendChild(li);
  }

  return s;
}

function renderScience() {
  const list = $("scienceList");
  for (const f of FACTS) {
    const el = document.createElement("div");
    el.className = "fact";
    const p = document.createElement("p");
    p.textContent = f.text;
    const c = document.createElement("cite");
    c.textContent = f.cite;
    el.append(p, c);
    list.appendChild(el);
  }
}

// ---------- rewards ----------

function pickFact(gains) {
  // Prefer a fact about the stat that grew the most this time.
  const top = Object.entries(gains).sort((a, b) => b[1] - a[1])[0][0];
  const pool = FACTS.filter((f) => f.stat === top);
  const list = pool.length && Math.random() < 0.7 ? pool : FACTS;
  return list[Math.floor(Math.random() * list.length)];
}

function confetti() {
  const box = $("confetti");
  const colors = ["#e8743b", "#3e9b6b", "#f2c14e", "#5b8def", "#d65db1"];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("i");
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = Math.random() * 0.4 + "s";
    box.appendChild(c);
  }
  setTimeout(() => (box.innerHTML = ""), 2200);
}

function showReward(entry, before, after) {
  const gains = statGains(entry);
  const bonus = [];
  if (entry.type === "thanks") bonus.push("ucapan terima kasih");
  if (entry.text.length >= 50) bonus.push("detail");
  if (entry.firstToday) bonus.push("hari pertama");
  $("toastXp").innerHTML = `+${entry.xp} XP` + (bonus.length ? `<small>Bonus: ${bonus.join(", ")}</small>` : "");

  const tags = $("toastStats");
  tags.innerHTML = "";
  for (const st of STATS) {
    if (!gains[st.id]) continue;
    const t = document.createElement("span");
    t.textContent = `${st.icon} ${st.name} +${gains[st.id]}`;
    tags.appendChild(t);
  }
  const lvBefore = levelFromXp(before.xp).level;
  const lvAfter = levelFromXp(after.xp).level;
  if (lvAfter > lvBefore) {
    const t = document.createElement("span");
    t.textContent = `⬆️ Naik ke Level ${lvAfter}!`;
    tags.prepend(t);
  }
  for (const id of after.badges.filter((b) => !before.badges.includes(b))) {
    const b = BADGES.find((x) => x.id === id);
    const t = document.createElement("span");
    t.textContent = `${b.icon} Lencana baru: ${b.name}`;
    tags.prepend(t);
  }

  const fact = pickFact(gains);
  $("toastFact").textContent = fact.text;
  $("toastCite").textContent = fact.cite;
  $("toast").classList.remove("hidden");
  confetti();
}

// ---------- events ----------

document.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => {
    entryType = tab.dataset.type;
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });
    const thanks = entryType === "thanks";
    $("toWrap").classList.toggle("hidden", !thanks);
    $("textInput").placeholder = thanks
      ? "Terima kasih sebab… (bonus XP! Lagi best kalau awak hantar kepada mereka juga)"
      : "Hari ni saya bersyukur sebab…";
  };
});

$("entryForm").onsubmit = (ev) => {
  ev.preventDefault();
  const text = $("textInput").value.trim();
  if (!text) return;
  const ts = Date.now();
  const firstToday = !state.entries.some((e) => dayKey(e.ts) === dayKey(ts));
  let xp = 10;
  if (entryType === "thanks") xp += 10;
  if (text.length >= 50) xp += 5;
  if (firstToday) xp += 5;

  const entry = {
    id: ts.toString(36) + Math.random().toString(36).slice(2, 6),
    type: entryType,
    to: entryType === "thanks" ? $("toInput").value.trim() : "",
    text, cats: [...selectedCats], ts, xp,
  };
  const before = summarize();
  state.entries.push(entry);
  save();
  const after = render();
  showReward({ ...entry, firstToday }, before, after);

  $("textInput").value = "";
  $("toInput").value = "";
  selectedCats.clear();
  renderChips();
};

$("toastClose").onclick = () => $("toast").classList.add("hidden");

$("promptBtn").onclick = () => {
  const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  $("hint").textContent = "💡 " + p;
  $("textInput").focus();
};

$("resetBtn").onclick = () => {
  if (!confirm("Padam semua catatan, XP dan lencana? Tindakan ini tak boleh dibatalkan.")) return;
  state = { entries: [] };
  save();
  render();
};

renderChips();
renderScience();
render();
