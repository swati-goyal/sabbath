// Copied from public/app.js for GitHub Pages
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

function createConfetti(element) {
  const colors = ['#ff6b00', '#a855f7', '#ffd700', '#ff0000', '#00ff00', '#00ffff', '#ff00ff'];
  const confettiCount = 50;
  const container = document.createElement('div');
  container.className = 'confetti-container';
  element.style.position = 'relative';
  element.style.overflow = 'visible';
  element.appendChild(container);

  const rect = element.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-particle';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 4;
    const angle = (Math.PI * 2 * i) / confettiCount;
    const velocity = Math.random() * 300 + 200;
    const rotation = Math.random() * 720;
    
    confetti.style.position = 'absolute';
    confetti.style.left = centerX + 'px';
    confetti.style.top = centerY + 'px';
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    confetti.style.backgroundColor = color;
    confetti.style.borderRadius = '50%';
    confetti.style.opacity = '1';
    
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    confetti.style.setProperty('--tx', tx + 'px');
    confetti.style.setProperty('--ty', ty + 'px');
    confetti.style.setProperty('--rot', rotation + 'deg');
    
    container.appendChild(confetti);
  }

  setTimeout(() => {
    container.remove();
  }, 2000);
}

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

  // Trigger confetti
  createConfetti(resultEl);

  revealing = false;
}

revealBtn.addEventListener("click", doReveal);

// Make ghosts interactive
function makeGhostsInteractive() {
  const ghosts = document.querySelectorAll('.ghost');
  ghosts.forEach(ghost => {
    ghost.addEventListener('click', function(e) {
      e.stopPropagation();
      this.style.transform = 'scale(1.3) rotate(360deg)';
      this.style.filter = 'brightness(2)';
      setTimeout(() => {
        this.style.transform = '';
        this.style.filter = '';
      }, 500);
    });
    
    ghost.addEventListener('touchstart', function(e) {
      e.stopPropagation();
      this.style.transform = 'scale(1.2)';
      this.style.filter = 'brightness(1.5)';
    });
    
    ghost.addEventListener('touchend', function(e) {
      setTimeout(() => {
        this.style.transform = '';
        this.style.filter = '';
      }, 200);
    });
  });
}

// Auto-reveal when coming from QR (e.g., ?reveal=1)
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const shouldReveal = params.has("reveal") ? params.get("reveal") !== "0" : false;
  if (shouldReveal) {
    if (revealBtn) revealBtn.style.display = "none";
    doReveal();
  }
  makeGhostsInteractive();
});


