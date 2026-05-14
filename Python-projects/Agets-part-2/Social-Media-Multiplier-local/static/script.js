/* ── THEME ────────────────────────────────────────────────── */
(function () {
  const saved = localStorage.getItem('smm-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('smm-theme', next);
}

/* ── STATE ────────────────────────────────────────────────── */
const platforms    = { x: true, linkedin: true, instagram: false };
let selectedTone   = 'educational';
let statusTimer    = null;
let phaseIdx       = 0;

/* ── PHASES — each maps to a pipeline node id ─────────────── */
const PHASES = [
  { label: 'Reading blog',     node: 'node-auditor', arrow: null,      msg: 'Reading blog content...',             phase: '01 / Auditing' },
  { label: 'Extracting',       node: 'node-audit',   arrow: 'arrow-1', msg: 'Extracting key insights & quotes...', phase: '02 / Extracting' },
  { label: 'Writing posts',    node: 'node-omni',    arrow: 'arrow-2', msg: 'Omnichannel Marketer crafting posts...', phase: '03 / Writing' },
  { label: 'Finalising',       node: 'node-posts',   arrow: 'arrow-3', msg: 'Polishing social posts...',           phase: '04 / Finalising' },
  { label: 'Visual ideas',     node: 'node-visual',  arrow: 'arrow-4', msg: 'Visual Advisor generating image ideas...', phase: '05 / Visuals' },
  { label: 'Almost there',     node: null,           arrow: null,      msg: 'Almost there...',                     phase: '⏳ Finishing' },
];

/* ── PLATFORM TOGGLE ──────────────────────────────────────── */
function togglePlatform(el) {
  const p = el.dataset.platform;
  platforms[p] = !platforms[p];
  el.classList.toggle('active', platforms[p]);
}

/* ── TONE SELECT ──────────────────────────────────────────── */
function selectTone(el) {
  document.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  selectedTone = el.dataset.tone;
}

/* ── CHAR COUNT ───────────────────────────────────────────── */
function updateCharCount(el) {
  const count   = el.value.length;
  const counter = document.getElementById('char-count');
  counter.textContent = count.toLocaleString() + ' chars';
  counter.className   = 'char-count' + (count > 8000 ? ' over' : count > 5000 ? ' warn' : '');
}

/* ── ERROR BAR ────────────────────────────────────────────── */
function showError(msg) {
  const bar = document.getElementById('error-bar');
  document.getElementById('error-text').textContent = msg;
  bar.classList.add('visible');
}

function hideError() {
  document.getElementById('error-bar').classList.remove('visible');
}

/* ── PIPELINE NODE HIGHLIGHTS ─────────────────────────────── */
function clearPipelineHighlights() {
  document.querySelectorAll('.step-node').forEach(n => {
    n.classList.remove('active-phase', 'done-phase');
  });
  document.querySelectorAll('.pipeline-arrow').forEach(a => {
    a.classList.remove('flowing');
  });
}

function highlightPhase(idx) {
  const phase = PHASES[idx];
  if (!phase) return;

  // Mark previous nodes as done
  PHASES.slice(0, idx).forEach(p => {
    if (p.node) {
      const el = document.getElementById(p.node);
      if (el) { el.classList.remove('active-phase'); el.classList.add('done-phase'); }
    }
    if (p.arrow) {
      const ar = document.getElementById(p.arrow);
      if (ar) ar.classList.remove('flowing');
    }
  });

  // Highlight active node
  if (phase.node) {
    const el = document.getElementById(phase.node);
    if (el) { el.classList.add('active-phase'); el.classList.remove('done-phase'); }
  }

  // Animate the leading arrow
  if (phase.arrow) {
    const ar = document.getElementById(phase.arrow);
    if (ar) ar.classList.add('flowing');
  }
}

/* ── STATUS BAR ───────────────────────────────────────────── */
function showStatus(msg, phaseLabel) {
  const bar = document.getElementById('status-bar');
  bar.classList.add('visible');
  document.getElementById('status-text').textContent = msg;

  const phaseEl = document.getElementById('status-phase');
  if (phaseLabel) {
    phaseEl.textContent = phaseLabel;
    phaseEl.classList.add('visible');
  } else {
    phaseEl.classList.remove('visible');
  }
}

function hideStatus() {
  document.getElementById('status-bar').classList.remove('visible');
  document.getElementById('status-phase').classList.remove('visible');
}

function advancePhase() {
  if (phaseIdx >= PHASES.length) return;
  const p = PHASES[phaseIdx];
  showStatus(p.msg, p.phase);
  highlightPhase(phaseIdx);
  phaseIdx++;
}

/* ── COPY ─────────────────────────────────────────────────── */
function copyPost(btn, platform) {
  const el = document.getElementById('result-' + platform);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    btn.textContent = 'copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 2000);
  });
}

/* ── RENDER SOCIAL RESULTS ────────────────────────────────── */
function renderResults(postsOutput) {
  const platformNames = { x: 'X / Twitter thread', linkedin: 'LinkedIn post', instagram: 'Instagram caption' };
  const activePlatforms = Object.entries(platforms).filter(([, v]) => v).map(([k]) => k);

  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = '';

  activePlatforms.forEach(p => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <div class="result-header">
        <div class="result-platform"><div class="dot"></div>${platformNames[p]}</div>
        <button class="copy-btn" onclick="copyPost(this, '${p}')">copy</button>
      </div>
      <div class="result-body" id="result-${p}">${escapeHtml(postsOutput)}</div>
    `;
    resultsEl.appendChild(card);
  });

  resultsEl.classList.add('visible');
}

/* ── RENDER VISUAL SUGGESTIONS ────────────────────────────── */
const VISUAL_ICONS = { x: '🐦', linkedin: '💼', instagram: '📸', default: '🖼️' };
const FORMAT_LABELS = {
  'infographic':  'Infographic',
  'quote card':   'Quote Card',
  'photo':        'Photo',
  'illustration': 'Illustration',
  'carousel':     'Carousel',
  'chart':        'Chart / Graph',
};

function renderVisuals(visualOutput) {
  const section  = document.getElementById('visual-section');
  const body     = document.getElementById('visual-body');
  const activePlatforms = Object.entries(platforms).filter(([, v]) => v).map(([k]) => k);

  // Try to parse structured JSON from the crew output
  let suggestions = tryParseVisualJSON(visualOutput, activePlatforms);

  if (suggestions) {
    const grid = document.createElement('div');
    grid.className = 'visual-grid';

    suggestions.forEach(s => {
      const formatLabel = FORMAT_LABELS[s.format?.toLowerCase()] || s.format || 'Image';
      const icon = VISUAL_ICONS[s.platform?.toLowerCase()] || VISUAL_ICONS.default;
      const card = document.createElement('div');
      card.className = 'visual-card';
      card.innerHTML = `
        <div class="visual-thumb">${icon}</div>
        <div class="visual-card-body">
          <div class="visual-platform-tag">${s.platform || 'General'}</div>
          <div class="visual-desc">${escapeHtml(s.description || s.suggestion || '')}</div>
          <span class="visual-type">${formatLabel}</span>
        </div>
      `;
      grid.appendChild(card);
    });

    body.innerHTML = '';
    body.appendChild(grid);
  } else {
    // Fallback: render raw text
    body.innerHTML = `<div class="visual-raw">${escapeHtml(visualOutput)}</div>`;
  }

  section.classList.add('visible');
}

function tryParseVisualJSON(raw, activePlatforms) {
  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleaned);
    if (Array.isArray(data) && data.length > 0) return data;
    if (data.suggestions && Array.isArray(data.suggestions)) return data.suggestions;
  } catch (_) {}

  // If not JSON, build one card per active platform from raw text
  if (activePlatforms.length > 0) {
    return activePlatforms.map(p => ({
      platform: p.charAt(0).toUpperCase() + p.slice(1),
      description: raw.slice(0, 300),
      format: 'Image',
    }));
  }

  return null;
}

/* ── HELPERS ──────────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── RUN CREW ─────────────────────────────────────────────── */
function runCrew() {
  const url    = document.getElementById('blog-url').value.trim();
  const text   = document.getElementById('blog-text').value.trim();
  const urlRow = document.getElementById('url-row');

  hideError();

  if (!url && !text) {
    urlRow.classList.add('error');
    setTimeout(() => urlRow.classList.remove('error'), 1000);
    showError('Please enter a blog URL or paste some text first.');
    return;
  }

  const btn = document.getElementById('run-btn');
  btn.disabled = true;

  // Reset results
  const resultsEl = document.getElementById('results');
  resultsEl.classList.remove('visible');
  resultsEl.innerHTML = '';
  document.getElementById('visual-section').classList.remove('visible');

  // Start phased status
  phaseIdx = 0;
  clearPipelineHighlights();
  advancePhase();
  statusTimer = setInterval(() => {
    if (phaseIdx < PHASES.length) advancePhase();
  }, 3500);

  const payload = {
    blog_url:  url,
    blog_text: text,
    tone:      selectedTone,
    platforms: Object.entries(platforms).filter(([, v]) => v).map(([k]) => k),
  };

  fetch('/generate', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
    .then(r => {
      if (!r.ok) return r.json().then(d => { throw new Error(d.error || `Server error ${r.status}`); });
      return r.json();
    })
    .then(data => {
      clearInterval(statusTimer);
      hideStatus();
      clearPipelineHighlights();
      btn.disabled = false;

      if (data.error) {
        showError(data.error);
        return;
      }

      const posts   = data.social_posts || data.result || data.output || '';
      const visuals = data.visual_suggestions || data.visuals || '';

      renderResults(posts);
      if (visuals) renderVisuals(visuals);
    })
    .catch(err => {
      clearInterval(statusTimer);
      hideStatus();
      clearPipelineHighlights();
      btn.disabled = false;
      showError(err.message || 'Could not reach the server. Is Flask running?');
      console.error(err);
    });
}