/**
 * PRAMOD RAMAKRISHNA — HIGH-OCTANE AUTOMOTIVE & SYSTEMS PORTFOLIO
 * Main Interactive HUD Script: Tachometer rev simulation, Drive Modes, Web Audio FX, & Filters
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTachometer();
  initDriveModes();
  initProjectFilters();
  initAudioHUD();
});

/* ==========================================================================
   Web Audio API Synthesizer (Zero External Audio Files Needed)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playClickSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
}

function playRevSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    // Engine RPM sweep simulation
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.35);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.7);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.35);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } catch (e) {}
}

function initAudioHUD() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      getAudioContext();
      soundBtn.classList.add('active');
      soundBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        <span>AUDIO: ON</span>
      `;
      playClickSound();
    } else {
      soundBtn.classList.remove('active');
      soundBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        <span>AUDIO: MUTED</span>
      `;
    }
  });

  // Attach mechanical clicks to buttons
  document.querySelectorAll('button, .mode-btn, .filter-btn, .motorsport-card').forEach(el => {
    el.addEventListener('mouseenter', () => playClickSound());
  });
}

/* ==========================================================================
   Tachometer RPM & Shift Lights Simulation
   ========================================================================== */
function initTachometer() {
  const tachVal = document.getElementById('tach-value');
  const tachWidget = document.getElementById('tachometer-widget');
  const leds = document.querySelectorAll('.tach-led');
  if (!tachVal || !tachWidget) return;

  let currentRPM = 1200;
  let targetRPM = 1200;
  let isRevving = false;

  function updateShiftLights(rpm) {
    const totalLeds = leds.length;
    const activeCount = Math.floor(((rpm - 1000) / 7500) * totalLeds);
    leds.forEach((led, idx) => {
      if (idx <= activeCount) {
        led.classList.add('on');
      } else {
        led.classList.remove('on');
      }
    });
  }

  function renderTach() {
    currentRPM += (targetRPM - currentRPM) * 0.15;
    tachVal.textContent = Math.round(currentRPM).toLocaleString();
    updateShiftLights(currentRPM);

    // Subtle needle idle fluctuation
    if (!isRevving && Math.abs(currentRPM - targetRPM) < 50) {
      targetRPM = 1150 + Math.random() * 100;
    }
    requestAnimationFrame(renderTach);
  }
  renderTach();

  tachWidget.addEventListener('mouseenter', () => {
    isRevving = true;
    targetRPM = 7800 + Math.random() * 800;
    playRevSound();
  });

  tachWidget.addEventListener('mouseleave', () => {
    isRevving = false;
    targetRPM = 1200;
  });

  tachWidget.addEventListener('click', () => {
    targetRPM = 8600;
    playRevSound();
    setTimeout(() => {
      if (!tachWidget.matches(':hover')) targetRPM = 1200;
    }, 450);
  });
}

/* ==========================================================================
   Drive Mode Switching
   ========================================================================== */
function initDriveModes() {
  const modeBtns = document.querySelectorAll('.mode-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playClickSound();

      const mode = btn.getAttribute('data-mode');
      // Sync with project filters
      filterBtns.forEach(f => {
        if (f.getAttribute('data-filter') === mode) {
          f.click();
        }
      });
    });
  });
}

/* ==========================================================================
   Project Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.motorsport-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playClickSound();

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            if (card.style.opacity === '0') card.style.display = 'none';
          }, 180);
        }
      });
    });
  });
}

/* ==========================================================================
   Theme Toggling
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('pramod_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const next = active === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('pramod_theme', next);
      playClickSound();
    });
  }
}

/* ==========================================================================
   Navigation
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      playClickSound();
    });
  }
}
