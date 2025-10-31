let songs = [];
let songsOrder = [];
let songsLoaded = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function loadSongs() {
  if (songsLoaded) return;
  try {
    const res = await fetch('songs.txt', { cache: 'no-cache' });
    const txt = await res.text();
    const raw = txt.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const filtered = raw.filter(title => {
      const lower = title.toLowerCase();
      return lower !== 'n.i.b.' && lower !== 'nib' && lower !== 'n.i.b' && 
             !lower.includes('nativity in black');
    });
    const unique = Array.from(new Set(filtered));
    songs = unique.map(title => ({ title, album: '' }));
    const stored = sessionStorage.getItem('songOrder');
    if (stored) {
      const parsed = JSON.parse(stored);
      songsOrder = parsed.filter(idx => idx >= 0 && idx < songs.length);
    }
    if (!songsOrder.length) {
      songsOrder = shuffle([...Array(songs.length).keys()]);
      sessionStorage.setItem('songOrder', JSON.stringify(songsOrder));
    }
    songsLoaded = true;
  } catch (e) {
    // fallback: single item to avoid crash
    songs = [{ title: 'Black Sabbath', album: '' }];
    songsOrder = [0];
    songsLoaded = true;
  }
}

function getNextSongUnique() {
  if (!songsOrder.length) {
    songsOrder = shuffle([...Array(songs.length).keys()]);
  }
  const nextIndex = songsOrder.shift();
  sessionStorage.setItem('songOrder', JSON.stringify(songsOrder));
  return songs[nextIndex];
}

function spookyScramble(text) {
  const glyphs = "ꜩ𖤐ᛟᚠᚱᛃᛞᛉᚨᚲᚷᛏᚺᚾᛜᛇᛒᛁᛋᛗ◊◬◈✶✷✹✦".split("");
  return text
    .split("")
    .map((ch, i) => (i % 2 === 0 ? glyphs[(i * 7) % glyphs.length] : ch))
    .join("");
}

const revealBtn = document.getElementById("reveal-btn");
const resultEl = document.getElementById("result");
const titleEl = document.getElementById("song-title");
const albumEl = document.getElementById("album-name");
const listenEl = document.getElementById("listen-link");
const sceneEl = document.getElementById("scene");

let revealing = false;

function createBigBangExplosion() {
  const layer = document.createElement("div");
  layer.className = "big-bang-layer";
  sceneEl.appendChild(layer);

  // Create bright flash effect
  const flash = document.createElement("div");
  flash.className = "big-bang-flash";
  layer.appendChild(flash);

  // Create many bats as confetti (60-80 bats for big bang effect)
  const batCount = 70 + Math.floor(Math.random() * 20);
  for (let i = 0; i < batCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    // Vary the distance more for big bang - some go far, some medium, some close
    const distVariation = Math.random();
    const dist = distVariation < 0.3 ? 200 + Math.random() * 150 : // close
                 distVariation < 0.7 ? 350 + Math.random() * 200 : // medium
                                       500 + Math.random() * 300;   // far
    const rot = (Math.random() * 360).toFixed(1) + "deg";
    const tx = Math.cos(ang) * dist;
    const ty = Math.sin(ang) * dist;
    const delay = Math.random() * 50; // slight stagger
    
    const b = document.createElement("div");
    b.className = "bat confetti";
    b.style.setProperty("--tx", `${tx.toFixed(1)}px`);
    b.style.setProperty("--ty", `${ty.toFixed(1)}px`);
    b.style.setProperty("--rot", rot);
    b.style.setProperty("--dur", `${800 + Math.random() * 400}ms`);
    b.style.animationDelay = `${delay}ms`;
    layer.appendChild(b);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      layer.remove();
      resolve();
    }, 1300);
  });
}

async function doReveal() {
  if (revealing) return;
  revealing = true;

  if (!songsLoaded) await loadSongs();
  const pick = getNextSongUnique();

  // Hide result initially, show during explosion
  resultEl.classList.remove("hidden");
  resultEl.style.opacity = "0";
  titleEl.textContent = "";
  albumEl.textContent = "";

  // Create big bang explosion
  await createBigBangExplosion();

  // Reveal song after explosion
  await new Promise(r => setTimeout(r, 200));
  resultEl.style.opacity = "1";
  resultEl.style.transition = "opacity 0.6s ease-in";
  
  titleEl.textContent = pick.title + "   ";
  albumEl.textContent = pick.album;
  const q = encodeURIComponent(`${pick.title} by Black Sabbath`);
  listenEl.href = `https://www.youtube.com/results?search_query=${q}`;
  listenEl.textContent = "Listen";

  if (window.navigator && "vibrate" in window.navigator) {
    try { window.navigator.vibrate([50, 30, 50]); } catch {}
  }

  revealing = false;
}

revealBtn.addEventListener("click", doReveal);

// Auto-reveal when coming from QR (e.g., ?reveal=1)
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const shouldReveal = params.has("reveal") ? params.get("reveal") !== "0" : false;
  if (shouldReveal) {
    if (revealBtn) revealBtn.style.display = "none";
    doReveal();
  }
});


