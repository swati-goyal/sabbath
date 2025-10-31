// Copied from public/app.js for GitHub Pages
const songs = [
  { title: "Black Sabbath", album: "Black Sabbath (1970)", url: "https://open.spotify.com/track/6z7AAYR1M1q7oZ6o6U3m8W" },
  { title: "Paranoid", album: "Paranoid (1970)", url: "https://open.spotify.com/track/7F02x6EKYIQV3VcTaTm7oN" },
  { title: "War Pigs", album: "Paranoid (1970)", url: "https://open.spotify.com/track/6hb0qjK3l1eQ1BM8E4YB4O" },
  { title: "Iron Man", album: "Paranoid (1970)", url: "https://open.spotify.com/track/6b2oQwSGFkzsMtQruIWm2p" },
  { title: "Children of the Grave", album: "Master of Reality (1971)", url: "https://open.spotify.com/track/6lVBiaG8hvfydfdlPpqs5a" },
  { title: "Sweet Leaf", album: "Master of Reality (1971)", url: "https://open.spotify.com/track/1y4eb6hmAvsqlDOl3fx9kk" },
  { title: "Sabbath Bloody Sabbath", album: "Sabbath Bloody Sabbath (1973)", url: "https://open.spotify.com/track/0g6cS1zsa3I8Q8V1B5Hq2Y" },
  { title: "N.I.B.", album: "Black Sabbath (1970)", url: "https://open.spotify.com/track/2HvgB0q8J1NnX2NDSSSXqo" },
  { title: "Heaven and Hell", album: "Heaven and Hell (1980)", url: "https://open.spotify.com/track/0Yp4FQO0O5jM90oCbGyFva" },
  { title: "Fairies Wear Boots", album: "Paranoid (1970)", url: "https://open.spotify.com/track/0nUoWZLxE3obVhtSGcVwqE" }
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

let revealing = false;

revealBtn.addEventListener("click", async () => {
  if (revealing) return;
  revealing = true;

  const pick = getRandomSong();
  resultEl.classList.remove("hidden");

  const frames = 24;
  for (let i = 0; i < frames; i++) {
    titleEl.textContent = spookyScramble(pick.title);
    await new Promise(r => setTimeout(r, 40 + i * 6));
  }

  titleEl.textContent = pick.title + "   ";
  albumEl.textContent = pick.album;
  listenEl.href = pick.url;
  listenEl.textContent = "Play on Spotify";

  if (window.navigator && "vibrate" in window.navigator) {
    try { window.navigator.vibrate(40); } catch {}
  }

  revealing = false;
});


