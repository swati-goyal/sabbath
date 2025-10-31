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

async function doReveal() {
  if (revealing) return;
  revealing = true;

  if (!songsLoaded) await loadSongs();
  const pick = getNextSongUnique();

  resultEl.classList.remove("hidden");
  titleEl.textContent = pick.title;
  albumEl.textContent = pick.album;
  const q = encodeURIComponent(`${pick.title} by Black Sabbath`);
  listenEl.href = `https://www.youtube.com/results?search_query=${q}`;
  listenEl.textContent = "Listen";

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


