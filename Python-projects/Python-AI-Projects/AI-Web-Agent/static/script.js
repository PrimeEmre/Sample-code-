

//  setting clock 
function updateClock() {
  const now = new Date()
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-US', { hour12: false })
}
setInterval(updateClock, 1000)
updateClock()

// setting the tab switching 
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'))
    tab.classList.add('active');
    document.getElementById(target + '-panel').classList.add('active')
  });
});

// concettign the markdown rendering for the chat and report
function renderMd(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, s => `<ul>${s}</ul>`)
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// setting  chat message 
function appendMessage(role, content) {
  const container = document.getElementById('messages')

  const wrap = document.createElement('div')
  wrap.className = `message ${role}`

  const avatar = document.createElement('div')
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'assistant' ? 'JAR' : 'YOU'

  const body = document.createElement('div')
  body.className = 'msg-body';

  const label = document.createElement('div')
  label.className = 'msg-label';
  label.textContent = role === 'assistant' ? 'J.A.R.V.I.S' : 'OPERATOR'

  const bubble = document.createElement('div')
  bubble.className = 'msg-bubble';
  bubble.innerHTML = renderMd(content)

  body.appendChild(label)
  body.appendChild(bubble)

  if (role === 'assistant') {
    const btn = document.createElement('button')
    btn.className = 'speak-btn'
    btn.textContent = '▶ SPEAK'
    btn.dataset.text = content;
    btn.addEventListener('click', () => speakText(btn))
    body.appendChild(btn)
  }

  wrap.appendChild(avatar)
  wrap.appendChild(body)
  container.appendChild(wrap)
  container.scrollTop = container.scrollHeight
}

// ── Typing indicator ans setting the agernt ───────────────────────────────
function showTyping() {
  const container = document.getElementById('messages')
  const wrap = document.createElement('div')
  wrap.className = 'message assistant'
  wrap.id = 'typing-wrap';

  const avatar = document.createElement('div')
  avatar.className = 'msg-avatar';
  avatar.textContent = 'JAR';

  const body = document.createElement('div')
  body.className = 'msg-body';

  const bubble = document.createElement('div')
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>'

  body.appendChild(bubble);
  wrap.appendChild(avatar);
  wrap.appendChild(body);
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight
}

function removeTyping() {
  document.getElementById('typing-wrap')?.remove()
}

// ── Auto-resize textarea ───────────────────────────
const chatInput = document.getElementById('chatInput')

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px'
});

chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ── Send chat message ──────────────────────────────
const sendBtn = document.getElementById('sendBtn')

async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg || sendBtn.disabled) return;

  appendMessage('user', msg);
  chatInput.value = '';
  chatInput.style.height = 'auto';
  sendBtn.disabled = true;
  showTyping();

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    removeTyping();
    appendMessage('assistant', data.response || data.error || 'No response.');
  } catch (err) {
    removeTyping();
    appendMessage('assistant', `Connection error: ${err.message}`);
  }

  sendBtn.disabled = false;
  chatInput.focus();
}

sendBtn.addEventListener('click', sendMessage);

// ── Text to speech ─────────────────────────────────
async function speakText(btn) {
  const text = (btn.dataset.text || '').trim();
  if (!text) return;

  btn.textContent = '◼ PLAYING';
  btn.disabled = true;

  try {
    const res = await fetch('/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.slice(0, 500) })
    });

    if (!res.ok) throw new Error('TTS failed');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => {
      btn.textContent = '▶ SPEAK';
      btn.disabled = false;
      URL.revokeObjectURL(url);
    };
  } catch {
    btn.textContent = '▶ SPEAK';
    btn.disabled = false;
  }
}

// attach speak to existing welcome button
document.querySelector('.speak-btn')?.addEventListener('click', function () {
  speakText(this);
});

// ── Research agent ─────────────────────────────────
const researchBtn  = document.getElementById('researchBtn');
const researchInput = document.getElementById('researchInput');
const researchStatus = document.getElementById('researchStatus');
const reportBox    = document.getElementById('reportBox');

researchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') startResearch();
});

researchBtn.addEventListener('click', startResearch);

const STATUS_STEPS = [
  'INITIALIZING SEARCH AGENT...',
  'SCANNING WEB SOURCES...',
  'READING INTELLIGENCE DATA...',
  'CROSS-REFERENCING FINDINGS...',
  'SYNTHESIZING REPORT...',
  'COMPILING RESULTS...'
];

async function startResearch() {
  const topic = researchInput.value.trim();
  if (!topic || researchBtn.disabled) return;

  researchBtn.disabled = true;
  reportBox.classList.remove('visible');
  reportBox.innerHTML = '';

  researchStatus.className = 'research-status running';
  researchStatus.querySelector('.rs-dot') || researchStatus.insertAdjacentHTML('afterbegin', '<div class="rs-dot"></div>');

  let step = 0;
  const ticker = setInterval(() => {
    researchStatus.querySelector('.rs-text').textContent = STATUS_STEPS[step % STATUS_STEPS.length];
    step++;
  }, 3200);

  try {
    const res = await fetch('/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });

    clearInterval(ticker);

    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const data = await res.json();

    researchStatus.className = 'research-status';
    researchStatus.querySelector('.rs-text').textContent =
      `REPORT COMPLETE — SAVED TO ${data.saved_to}`;

    // Render report
    reportBox.innerHTML = renderMd(data.report);

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'report-actions';

    // Download
    const dl = document.createElement('a');
    dl.className = 'action-btn';
    dl.textContent = '↓ DOWNLOAD .MD';
    dl.href = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(data.report);
    dl.download = topic.slice(0, 30).replace(/ /g, '_') + '.md';

    // Copy
    const copy = document.createElement('button');
    copy.className = 'action-btn';
    copy.textContent = '⎘ COPY';
    copy.addEventListener('click', () => {
      navigator.clipboard.writeText(data.report);
      copy.textContent = '✓ COPIED';
      setTimeout(() => copy.textContent = '⎘ COPY', 2000);
    });

    // Send to chat
    const toChat = document.createElement('button');
    toChat.className = 'action-btn';
    toChat.textContent = '→ SEND TO CHAT';
    toChat.addEventListener('click', () => {
      document.querySelector('.tab[data-tab="chat"]').click();
      appendMessage('assistant', `**Research Report: ${topic}**\n\n${data.report}`);
    });

    actions.append(dl, copy, toChat);
    reportBox.appendChild(actions);
    reportBox.classList.add('visible');

  } catch (err) {
    clearInterval(ticker);
    researchStatus.className = 'research-status';
    researchStatus.querySelector('.rs-text').textContent = `ERROR: ${err.message}`;
  }

  researchBtn.disabled = false;
}
