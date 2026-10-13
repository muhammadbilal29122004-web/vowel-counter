// "Will You Marry Me?" Romantic Interactive Logic

const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const noText = document.getElementById('no-text');
const dodgeHint = document.getElementById('dodge-hint');
const successScreen = document.getElementById('success-screen');
const btnRestart = document.getElementById('btn-restart');
const heartsContainer = document.getElementById('hearts-bg');

// Funny evasion messages
const dodgeMessages = [
  "Nice try! 😜",
  "Can't catch me! 🏃‍♂️",
  "Are you sure? 🥺",
  "Think again! 😉",
  "Wrong button! ❤️",
  "Nope! 🙈",
  "Catch me if you can! 💨",
  "Error: 'No' not found! 😂",
  "Just say YES! 💍",
  "Almost got me! 😆"
];

let dodgeCount = 0;
let yesScale = 1;

/**
 * Generate gentle background floating hearts
 */
function createFloatingHearts() {
  const heartSymbols = ['❤️', '💖', '💕', '💗', '💓', '✨'];
  const count = 22;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart-item';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${5 + Math.random() * 7}s`;
    heart.style.animationDelay = `${Math.random() * 6}s`;
    heart.style.fontSize = `${16 + Math.random() * 22}px`;
    heartsContainer.appendChild(heart);
  }
}

let currentTx = 0;
let currentTy = 0;
let lastDodgeTime = 0;

/**
 * Move the "No" button smoothly to a random safe position within the viewport
 * Guaranteed to stay 100% visible on screen at all times!
 */
function dodgeNoButton(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  const now = Date.now();
  if (now - lastDodgeTime < 160) return;
  lastDodgeTime = now;

  // Current bounding rect
  const rect = btnNo.getBoundingClientRect();
  const btnW = rect.width || 120;
  const btnH = rect.height || 50;

  // Base position without translation
  const baseLeft = rect.left - currentTx;
  const baseTop = rect.top - currentTy;

  // Viewport bounds with generous safe padding so it NEVER clips or hides
  const padding = 35;
  const minX = padding;
  const maxX = Math.max(minX + 20, window.innerWidth - btnW - padding);
  const minY = padding;
  const maxY = Math.max(minY + 20, window.innerHeight - btnH - padding);

  // Mouse / cursor position
  const mouseX = (e && typeof e.clientX === 'number') ? e.clientX : (rect.left + btnW / 2);
  const mouseY = (e && typeof e.clientY === 'number') ? e.clientY : (rect.top + btnH / 2);

  // Pick candidate position far away from cursor
  let bestX = minX;
  let bestY = minY;
  let maxDist = -1;

  for (let i = 0; i < 15; i++) {
    const candidateX = Math.floor(minX + Math.random() * (maxX - minX));
    const candidateY = Math.floor(minY + Math.random() * (maxY - minY));
    const dist = Math.hypot((candidateX + btnW / 2) - mouseX, (candidateY + btnH / 2) - mouseY);

    if (dist > maxDist) {
      maxDist = dist;
      bestX = candidateX;
      bestY = candidateY;
    }
  }

  // Calculate translation required from base
  currentTx = Math.round(bestX - baseLeft);
  currentTy = Math.round(bestY - baseTop);

  btnNo.style.transform = `translate(${currentTx}px, ${currentTy}px)`;

  // Cycle through funny evasion texts
  dodgeCount++;
  noText.textContent = dodgeMessages[dodgeCount % dodgeMessages.length];

  // Grow the Yes button slightly every dodge to encourage saying Yes!
  yesScale = Math.min(yesScale + 0.08, 1.85);
  btnYes.style.transform = `scale(${yesScale})`;

  // Update playful hint
  if (dodgeCount === 1) {
    dodgeHint.textContent = "Hey! The 'No' button is running away! 🏃‍♂️💨";
  } else if (dodgeCount === 3) {
    dodgeHint.textContent = "You can't catch 'No'! Say YES instead! 😉❤️";
  } else if (dodgeCount >= 6) {
    dodgeHint.textContent = "Look how big the YES button is! Just click it! 😍💍";
  }
}

/**
 * Proximity detection - if cursor approaches within 75px, dodge early!
 */
function handleProximityCheck(e) {
  if (successScreen.classList.contains('hidden') === false) return;

  const rect = btnNo.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;

  const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

  // If mouse is within 75 pixels of button center
  if (distance < 75) {
    dodgeNoButton(e);
  }
}

/**
 * Reset game if user wants to experience it again
 */
function resetProposal() {
  successScreen.classList.add('hidden');
  currentTx = 0;
  currentTy = 0;
  btnNo.style.transform = 'translate(0px, 0px)';
  noText.textContent = "No";
  dodgeCount = 0;
  yesScale = 1;
  btnYes.style.transform = 'scale(1)';
  dodgeHint.textContent = "Hint: Choose wisely! 😉";
}

// Event Listeners for the "No" button
btnNo.addEventListener('mouseenter', dodgeNoButton);
btnNo.addEventListener('mouseover', dodgeNoButton);
btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
btnNo.addEventListener('pointerenter', dodgeNoButton);
btnNo.addEventListener('click', (e) => {
  e.preventDefault();
  dodgeNoButton(e);
});

// Proximity evasion on mouse movement across screen
window.addEventListener('mousemove', handleProximityCheck);

// Yes button event
btnYes.addEventListener('click', celebrateYes);

// Restart button
btnRestart.addEventListener('click', resetProposal);

// Initialize background floating hearts
createFloatingHearts();
