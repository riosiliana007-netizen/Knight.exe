const screens = {
  title: document.getElementById("title-screen"),
  story: document.getElementById("story-screen"),
  ending: document.getElementById("ending-screen"),
};

const startButton = document.getElementById("start-button");
const continueButton = document.getElementById("continue-button");
const restartButton = document.getElementById("restart-button");
const soundToggle = document.getElementById("sound-toggle");
const speakerEl = document.getElementById("speaker");
const dialogueEl = document.getElementById("dialogue-text");
const choicesEl = document.getElementById("choices");
const finalWhisper = document.getElementById("final-whisper");
const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

let currentNode = "intro";
let typingTimer = null;
let soundOn = true;
let audioCtx = null;
let musicTimer = null;
let fireTimer = null;
let animationFrame = null;
let fireFrame = 0;
let stars = [];

const story = {
  intro: {
    speaker: "TRAVELER",
    text: "May I ask you something?",
    next: "q1",
  },

  q1: {
    speaker: "TRAVELER",
    text: "Why do people keep walking, even when they are tired?",
    choices: [
      { text: "Because someone waits for them.", next: "q1_hope", tag: "hope" },
      { text: "Because stopping hurts more.", next: "q1_endurance", tag: "endurance" },
      { text: "I don't know anymore.", next: "q1_lost", tag: "honesty" },
    ],
  },
  q1_hope: {
    speaker: "TRAVELER",
    text: "Then never forget the one waiting. Hope is a quiet lantern, but it still knows the road.",
    next: "q2",
  },
  q1_endurance: {
    speaker: "TRAVELER",
    text: "Some roads are worth every blister. Just remember that endurance is not the same as walking alone.",
    next: "q2",
  },
  q1_lost: {
    speaker: "TRAVELER",
    text: "Sometimes admitting that is the first honest step. A lost road can still lead somewhere true.",
    next: "q2",
  },

  q2: {
    speaker: "TRAVELER",
    text: "If you could erase one memory, would you?",
    choices: [
      { text: "Yes.", next: "q2_yes", tag: "erase" },
      { text: "No.", next: "q2_no", tag: "keep" },
      { text: "Only the painful parts.", next: "q2_pain", tag: "heal" },
    ],
  },
  q2_yes: {
    speaker: "TRAVELER",
    text: "I understand. Some memories feel heavier than armor. But even an empty place leaves a shape behind.",
    next: "q3",
  },
  q2_no: {
    speaker: "TRAVELER",
    text: "Then you have made peace with carrying your whole story. Few people can say that honestly.",
    next: "q3",
  },
  q2_pain: {
    speaker: "TRAVELER",
    text: "Pain asks to be removed. Meaning asks to be remembered. Perhaps healing is learning which voice is speaking.",
    next: "q3",
  },

  q3: {
    speaker: "TRAVELER",
    text: "One last question. Do you believe every encounter has a reason?",
    choices: [
      { text: "Yes.", next: "q3_yes", tag: "believe" },
      { text: "Not yet.", next: "q3_notyet", tag: "doubt" },
      { text: "I'm still searching.", next: "q3_search", tag: "searching" },
    ],
  },
  q3_yes: {
    speaker: "TRAVELER",
    text: "Then perhaps this meeting had one too.",
    next: "farewell",
  },
  q3_notyet: {
    speaker: "TRAVELER",
    text: "You do not have to believe before the meaning arrives. Sometimes the answer walks behind us.",
    next: "farewell",
  },
  q3_search: {
    speaker: "TRAVELER",
    text: "Then keep searching. Some encounters do not give answers. They simply leave a light beside the road.",
    next: "farewell",
  },

  farewell: {
    speaker: "TRAVELER",
    text: "Rest a little longer, Knight. The road will still be there when the fire grows quiet.",
    next: "end",
  },
};

const state = {
  answers: [],
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function typeText(text, done) {
  clearInterval(typingTimer);
  dialogueEl.textContent = "";
  let i = 0;

  typingTimer = setInterval(() => {
    dialogueEl.textContent += text[i] ?? "";
    if (soundOn && i % 3 === 0) playTick();
    i += 1;

    if (i >= text.length) {
      clearInterval(typingTimer);
      if (done) done();
    }
  }, 24);
}

function renderNode(id) {
  currentNode = id;
  choicesEl.innerHTML = "";
  continueButton.classList.add("hidden");

  if (id === "end") {
    endGame();
    return;
  }

  const node = story[id];
  speakerEl.textContent = node.speaker;

  typeText(node.text, () => {
    if (node.choices) {
      node.choices.forEach((choice) => {
        const button = document.createElement("button");
        button.className = "choice";
        button.textContent = choice.text;
        button.addEventListener("click", () => {
          state.answers.push(choice.tag);
          localStorage.setItem("knightExeAnswers", JSON.stringify(state.answers));
          renderNode(choice.next);
        });
        choicesEl.appendChild(button);
      });
    } else {
      continueButton.dataset.next = node.next;
      continueButton.classList.remove("hidden");
    }
  });
}

function initScene() {
  stars = Array.from({ length: 45 }, () => ({
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * 96),
    a: Math.random() * 0.8 + 0.2,
  }));
  drawScene();
}

function rect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawPixelCharacter(x, y, type) {
  if (type === "knight") {
    rect(x, y + 20, 18, 22, "#272b31");
    rect(x + 2, y + 7, 15, 15, "#596169");
    rect(x + 4, y + 9, 11, 9, "#8b949a");
    rect(x + 12, y + 11, 7, 3, "#d7aa67");
    rect(x - 5, y + 24, 9, 20, "#1b1e22");
    rect(x + 15, y + 24, 10, 18, "#1b1e22");
    rect(x + 1, y + 41, 7, 12, "#16181b");
    rect(x + 11, y + 41, 7, 12, "#16181b");
    rect(x - 7, y + 18, 4, 30, "#5f6570");
  } else {
    rect(x + 4, y + 16, 15, 22, "#452e38");
    rect(x + 6, y + 5, 11, 11, "#c98e70");
    rect(x + 3, y + 2, 17, 7, "#241b24");
    rect(x + 1, y + 14, 21, 7, "#7b3c47");
    rect(x + 1, y + 37, 7, 10, "#20171d");
    rect(x + 15, y + 37, 7, 10, "#20171d");
  }
}

function drawFire(cx, cy) {
  const frames = [
    [[0,0,6,10,"#f6d07a"],[-4,5,14,13,"#ee8a48"],[-8,13,22,8,"#aa3e2d"]],
    [[2,0,5,12,"#f6d07a"],[-5,6,15,12,"#ee8a48"],[-9,14,24,7,"#aa3e2d"]],
    [[-1,1,7,11,"#f6d07a"],[-6,7,17,12,"#ee8a48"],[-10,14,25,7,"#aa3e2d"]],
  ];
  frames[fireFrame % frames.length].forEach(([x,y,w,h,c]) => rect(cx+x, cy+y, w,h,c));
  rect(cx - 15, cy + 21, 30, 3, "#5b3326");
  rect(cx - 11, cy + 18, 22, 3, "#3d2821");
}

function drawScene() {
  ctx.imageSmoothingEnabled = false;
  rect(0, 0, 320, 180, "#0a0e18");

  stars.forEach((s, i) => {
    ctx.globalAlpha = i % 7 === fireFrame ? 1 : s.a;
    rect(s.x, s.y, 1, 1, "#cbd4d1");
  });
  ctx.globalAlpha = 1;

  rect(255, 16, 22, 22, "#c8d1ce");
  rect(262, 12, 22, 22, "#0a0e18");

  rect(0, 106, 320, 74, "#0c1012");
  rect(0, 128, 320, 52, "#121719");

  for (let i = 0; i < 15; i++) {
    const x = i * 24 - 8;
    rect(x, 75 + (i % 3) * 5, 6, 52, "#090c0d");
    rect(x - 7, 82 + (i % 3) * 5, 20, 5, "#090c0d");
    rect(x - 5, 90 + (i % 3) * 5, 16, 4, "#090c0d");
  }

  drawPixelCharacter(86, 102, "knight");
  drawPixelCharacter(218, 109, "traveler");
  drawFire(159, 123);

  rect(122, 150, 75, 2, "#2b2f2c");
  rect(131, 155, 58, 2, "#232724");

  fireFrame += 1;
  animationFrame = requestAnimationFrame(() => {
    setTimeout(drawScene, 160);
  });
}

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function playTone(freq, duration = 0.15, volume = 0.025, type = "square") {
  if (!soundOn) return;
  ensureAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.stop(audioCtx.currentTime + duration);
}

function playTick() {
  playTone(680 + Math.random() * 80, 0.025, 0.006, "square");
}

function startMusic() {
  if (!soundOn) return;
  ensureAudio();
  stopMusic();

  const melody = [220, 261.63, 293.66, 329.63, 293.66, 261.63, 196, 220];
  let i = 0;

  musicTimer = setInterval(() => {
    if (!soundOn) return;
    playTone(melody[i % melody.length], 0.55, 0.012, "triangle");
    if (i % 4 === 0) playTone(melody[i % melody.length] / 2, 0.8, 0.008, "sine");
    i += 1;
  }, 620);

  fireTimer = setInterval(() => {
    if (!soundOn || !audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 0.08;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) data[j] = (Math.random() * 2 - 1) * (1 - j / bufferSize);
    const source = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();
    gain.gain.value = 0.009;
    source.buffer = buffer;
    source.connect(gain).connect(audioCtx.destination);
    source.start();
  }, 900);
}

function stopMusic() {
  clearInterval(musicTimer);
  clearInterval(fireTimer);
}

function endGame() {
  stopMusic();
  showScreen("ending");

  const last = state.answers[state.answers.length - 1];
  const endings = {
    believe: "Some encounters arrive as answers.",
    doubt: "Some meanings reveal themselves only after we leave.",
    searching: "Some lights are small enough to carry.",
  };

  document.getElementById("ending-message").textContent =
    endings[last] || "Thank you for accepting this encounter.";

  setTimeout(() => finalWhisper.classList.remove("hidden"), 6500);
}

startButton.addEventListener("click", () => {
  ensureAudio();
  showScreen("story");
  initScene();
  startMusic();
  renderNode("intro");
});

continueButton.addEventListener("click", () => {
  renderNode(continueButton.dataset.next);
});

restartButton.addEventListener("click", () => {
  state.answers.length = 0;
  finalWhisper.classList.add("hidden");
  showScreen("story");
  startMusic();
  renderNode("intro");
});

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? "♪ ON" : "♪ OFF";
  if (soundOn) startMusic();
  else stopMusic();
});
