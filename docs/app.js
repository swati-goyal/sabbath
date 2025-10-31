// Copied from public/app.js for GitHub Pages
const songs = [
  { title: "Black Sabbath", album: "Black Sabbath (1970)", url: "https://www.youtube.com/watch?v=0lVdMbUx1_k" },
  { title: "Paranoid", album: "Paranoid (1970)", url: "https://www.youtube.com/watch?v=0qanF-91aJo" },
  { title: "War Pigs", album: "Paranoid (1970)", url: "https://www.youtube.com/watch?v=LQUXuQ6Zd9w" },
  { title: "Iron Man", album: "Paranoid (1970)", url: "https://www.youtube.com/watch?v=5s7_WbiR79E" },
  { title: "Children of the Grave", album: "Master of Reality (1971)", url: "https://www.youtube.com/watch?v=K3b6SGoN6dA" },
  { title: "Sweet Leaf", album: "Master of Reality (1971)", url: "https://www.youtube.com/watch?v=1gK1e2Tcbdg" },
  { title: "Sabbath Bloody Sabbath", album: "Sabbath Bloody Sabbath (1973)", url: "https://www.youtube.com/watch?v=0lUKBVrTmEM" },
  { title: "Heaven and Hell", album: "Heaven and Hell (1980)", url: "https://www.youtube.com/watch?v=8uPrS8H3vqI" },
  { title: "Fairies Wear Boots", album: "Paranoid (1970)", url: "https://www.youtube.com/watch?v=0qanF-91aJo&t=221s" }
];

function getRandomSong() {
  const index = Math.floor(Math.random() * songs.length);
  return songs[index];
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

revealBtn.addEventListener("click", async () => {
  if (revealing) return;
  revealing = true;

  const pick = getRandomSong();
  resultEl.classList.remove("hidden");

  const frames = 10;
  for (let i = 0; i < frames; i++) {
    titleEl.textContent = spookyScramble(pick.title);
    await new Promise(r => setTimeout(r, 16 + i * 3));
  }

  titleEl.textContent = pick.title + "   ";
  albumEl.textContent = pick.album;
  const q = encodeURIComponent(`${pick.title} ${pick.album}`);
  listenEl.href = `https://www.youtube.com/results?search_query=${q}`;
  listenEl.textContent = "Search on YouTube";

  if (window.navigator && "vibrate" in window.navigator) {
    try { window.navigator.vibrate(40); } catch {}
  }

  revealing = false;
});


