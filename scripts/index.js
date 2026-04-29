
// ── TYPEWRITER ──
const taglines = [
  "Data Science, AI and Cantankerousness",
  "Over Engineered Solutions!",
  "Answering the unimportant",
  "Professionally curious. Technically proficient."
];
let tlIdx = 0, tlChar = 0, tlDeleting = false;
const taglineEl = document.getElementById('tagline-text');

function typeWriter() {
  const full = taglines[tlIdx];
  if (!tlDeleting) {
    taglineEl.innerHTML = full.slice(0, tlChar + 1) + '<span class="cursor"></span>';
    tlChar++;
    if (tlChar === full.length) {
      tlDeleting = true;
      setTimeout(typeWriter, 2200); return;
    }
  } else {
    taglineEl.innerHTML = full.slice(0, tlChar - 1) + '<span class="cursor"></span>';
    tlChar--;
    if (tlChar === 0) {
      tlDeleting = false;
      tlIdx = (tlIdx + 1) % taglines.length;
    }
  }
  setTimeout(typeWriter, tlDeleting ? 38 : 68);
}
typeWriter();

// ── COUNT UP STATS ──
function countUp(el, target) {
  if (target === '∞') { el.textContent = '∞'; return; }
  let n = 0;
  const step = () => {
    n += Math.ceil(target / 40);
    if (n >= target) { el.textContent = target + '+'; return; }
    el.textContent = n;
    requestAnimationFrame(step);
  };
  step();
}
const statEls = document.querySelectorAll('.stat-val[data-count]');
let statsRan = false;
function runStats() {
  if (statsRan) return; statsRan = true;
  statEls.forEach(el => countUp(el, el.dataset.count));
}

// ── INTERSECTION OBSERVER ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Hero stats trigger
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) runStats();
}, { threshold: 0.5 });
heroObserver.observe(document.getElementById('hero'));

// ── TWEAKS ──
window.addEventListener('message', e => {
  if (e.data?.type === '__activate_edit_mode') document.getElementById('tweaks-panel').classList.add('open');
  if (e.data?.type === '__deactivate_edit_mode') document.getElementById('tweaks-panel').classList.remove('open');
});
window.parent.postMessage({type: '__edit_mode_available'}, '*');

document.getElementById('tweaks-close-btn').addEventListener('click', () => {
  document.getElementById('tweaks-panel').classList.remove('open');
  window.parent.postMessage({type: '__edit_mode_dismissed'}, '*');
});

const accentMap = {
  gold:  { main: 'oklch(0.76 0.18 80)',  dim: 'oklch(0.55 0.14 80)' },
  cyan:  { main: 'oklch(0.80 0.18 200)', dim: 'oklch(0.60 0.14 200)' },
  red:   { main: 'oklch(0.65 0.22 30)',  dim: 'oklch(0.50 0.16 30)' },
  green: { main: 'oklch(0.72 0.17 155)', dim: 'oklch(0.52 0.14 155)' },
};

document.getElementById('tweak-accent').addEventListener('change', function() {
  const c = accentMap[this.value];
  document.documentElement.style.setProperty('--gold', c.main);
  document.documentElement.style.setProperty('--gold-dim', c.dim);
});

document.getElementById('tweak-tagline').addEventListener('input', function() {
  // update the first tagline
  taglines[0] = this.value || taglines[0];
});

document.getElementById('tweak-font').addEventListener('change', function() {
  document.documentElement.style.setProperty('--font-mono', this.value);
});

document.getElementById('tweak-scanlines').addEventListener('change', function() {
  document.body.style.setProperty('--scanline-opacity', this.value === 'off' ? '0' : '1');
  const style = document.querySelector('style[data-scanlines]') || (() => {
    const s = document.createElement('style');
    s.setAttribute('data-scanlines', '');
    document.head.appendChild(s);
    return s;
  })();
  style.textContent = this.value === 'off' ? 'body::before { display: none; }' : '';
});
