const heartContainer = document.getElementById("heartContainer");

const heartSymbols = ["♥", "♡", "💗", "💕", "❤"];

function createHeart() {
  const heart = document.createElement("span");

  heart.classList.add("heart");
  heart.textContent =
    heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

  const left = Math.random() * 100;
  const size = Math.random() * 20 + 15;
  const duration = Math.random() * 4 + 5;

  heart.style.left = `${left}%`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${duration}s`;

  heartContainer.appendChild(heart);

  const explodeTimer = setTimeout(() => {
    const rect = heart.getBoundingClientRect();

    if (heart.isConnected) {
      explodeHeart(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      heart.remove();
    }
  }, duration * 1000 * 0.85);

  heart.addEventListener("animationend", () => {
    clearTimeout(explodeTimer);
    heart.remove();
  }, { once: true });
}

function explodeHeart(x, y) {
  const particleCount = 8;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");

    particle.classList.add("particle");
    particle.textContent = heartSymbols[
      Math.floor(Math.random() * heartSymbols.length)
    ];

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.fontSize = `${Math.random() * 12 + 10}px`;

    const angle = (Math.PI * 2 * i) / particleCount;
    const distance = Math.random() * 70 + 35;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    particle.style.setProperty("--x", `${moveX}px`);
    particle.style.setProperty("--y", `${moveY}px`);

    heartContainer.appendChild(particle);

    particle.addEventListener("animationend", () => {
      particle.remove();
    }, { once: true });
  }
}

setInterval(createHeart, 350);

// Hiệu ứng nổ khi nhấn vào nền
document.addEventListener("click", (event) => {
  if (event.target.closest(".btn")) {
    return;
  }

  explodeHeart(event.clientX, event.clientY);
});

function setupPassword(buttonId, modalId, closeId, formId, inputId, errorId, password, page) {
  const button = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);
  const close = document.getElementById(closeId);
  const form = document.getElementById(formId);
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  button.addEventListener("click", () => {
    modal.hidden = false;
    input.value = "";
    error.hidden = true;
    input.focus();
  });

  close.addEventListener("click", () => modal.hidden = true);

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.hidden = true;
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    if (input.value === password) {
      window.location.href = page;
    } else {
      error.hidden = false;
      input.select();
    }
  });
}

setupPassword(
  "clubButton", "clubPasswordModal", "closeClubPassword",
  "clubPasswordForm", "clubPasswordInput", "clubPasswordError",
  "NKTechClubGen1", "club.html"
);

setupPassword(
  "class12a1Button", "classPasswordModal", "closeClassPassword",
  "classPasswordForm", "classPasswordInput", "classPasswordError",
  "12A1_2427", "12a1.html"
);
