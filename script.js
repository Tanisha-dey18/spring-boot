const wordsEl = document.getElementById("words");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const resultEl = document.getElementById("result");
const resultTextEl = document.getElementById("result-text");
const bestEl = document.getElementById("best");
const durationButtons = document.querySelectorAll(".durations button");

let duration = 30;
let timeLeft, timer, startedAt;
let words, wordEls, index;
let correctChars, typedChars;

function pickWords(count) {
  return Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
}

function reset() {
  clearInterval(timer);
  timer = null;
  timeLeft = duration;
  index = 0;
  correctChars = 0;
  typedChars = 0;
  words = pickWords(200);

  wordsEl.innerHTML = "";
  wordEls = words.map((w) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = w;
    wordsEl.append(span);
    return span;
  });
  wordEls[0].classList.add("current");
  wordsEl.scrollTop = 0;

  inputEl.value = "";
  inputEl.disabled = false;
  resultEl.hidden = true;
  timeEl.textContent = duration;
  wpmEl.textContent = 0;
  accuracyEl.textContent = 100;
  inputEl.focus();
}

function start() {
  startedAt = Date.now();
  timer = setInterval(() => {
    timeLeft = duration - Math.floor((Date.now() - startedAt) / 1000);
    timeEl.textContent = Math.max(timeLeft, 0);
    updateStats();
    if (timeLeft <= 0) finish();
  }, 200);
}

function updateStats() {
  const minutes = Math.max((Date.now() - startedAt) / 60000, 1 / 60);
  // Standard WPM: 5 characters = 1 word
  wpmEl.textContent = Math.round(correctChars / 5 / minutes);
  accuracyEl.textContent = typedChars ? Math.round((correctChars / typedChars) * 100) : 100;
}

function finish() {
  clearInterval(timer);
  inputEl.disabled = true;
  updateStats();

  const wpm = Number(wpmEl.textContent);
  const key = `type-sprint-best-${duration}`;
  let best = 0;
  try { best = Number(localStorage.getItem(key)) || 0; } catch {}

  resultTextEl.textContent = `You typed ${wpm} WPM with ${accuracyEl.textContent}% accuracy.`;
  if (wpm > best) {
    try { localStorage.setItem(key, wpm); } catch {}
    bestEl.textContent = best ? `🎉 New personal best! (was ${best})` : "🎉 First score saved as your best!";
  } else {
    bestEl.textContent = `Your best for ${duration}s: ${best} WPM`;
  }
  resultEl.hidden = false;
}

function submitWord() {
  const typed = inputEl.value.trim();
  const target = words[index];
  const el = wordEls[index];

  // Count the space as a character, like most typing tests
  typedChars += typed.length + 1;
  if (typed === target) correctChars += target.length + 1;

  el.classList.remove("current", "typo");
  el.classList.add(typed === target ? "correct" : "wrong");

  index++;
  const next = wordEls[index];
  next.classList.add("current");

  // Scroll so the current word stays on the second line
  if (next.offsetTop - wordsEl.offsetTop > wordsEl.scrollTop + 40) {
    wordsEl.scrollTop = next.offsetTop - wordsEl.offsetTop - 35;
  }

  inputEl.value = "";
  updateStats();
}

inputEl.addEventListener("input", () => {
  if (!timer && inputEl.value.trim()) start();

  if (inputEl.value.endsWith(" ")) {
    if (inputEl.value.trim()) submitWord();
    else inputEl.value = "";
    return;
  }

  const isTypo = !words[index].startsWith(inputEl.value);
  wordEls[index].classList.toggle("typo", isTypo);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") reset();
});

document.getElementById("restart").onclick = reset;

durationButtons.forEach((btn) => {
  btn.onclick = () => {
    durationButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    duration = Number(btn.dataset.seconds);
    reset();
  };
});

reset();
