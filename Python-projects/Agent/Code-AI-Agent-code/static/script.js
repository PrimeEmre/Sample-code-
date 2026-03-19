// ─────────────────────────────────────────────────────────────
// SYNTAX HIGHLIGHTING ENGINE
// ─────────────────────────────────────────────────────────────

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function highlight(code, lang) {
  const lines = escapeHtml(code).split('\n')
  return lines.map(line => {
    switch (lang) {
      case 'python':     return highlightPython(line)
      case 'javascript':
      case 'typescript': return highlightJS(line)
      case 'html':       return highlightHTML(line)
      case 'css':        return highlightCSS(line)
      case 'java':       return highlightJava(line)
      case 'cpp':        return highlightCPP(line)
      case 'sql':        return highlightSQL(line)
      default:           return line
    }
  }).join('\n')
}

// ── PYTHON ────────────────────────────────────────────────────
function highlightPython(line) {
  if (/^\s*#/.test(line)) return `<span class="tok-comment">${line}</span>`
  let result = '', i = 0
  const KEYWORDS = new Set(['def','class','import','from','return','if','elif','else','for',
    'while','try','except','finally','with','as','in','not','and','or','is','lambda','pass',
    'break','continue','raise','yield','async','await','global','nonlocal','del','assert'])
  const BUILTINS = new Set(['print','len','range','type','int','str','float','list','dict',
    'set','tuple','bool','None','True','False','super','self','cls','open','input',
    'enumerate','zip','map','filter','sorted','reversed','isinstance','hasattr','getattr','setattr'])
  while (i < line.length) {
    if (line[i] === '#') { result += `<span class="tok-comment">${line.slice(i)}</span>`; break }
    if ((line[i]==='f'||line[i]==='b'||line[i]==='r') && (line[i+1]==='"'||line[i+1]==="'")) {
      const q=line[i+1]; let j=i+2
      while(j<line.length&&line[j]!==q){if(line[j]==='\\')j++;j++}
      result+=`<span class="tok-string">${line.slice(i,j+1)}</span>`; i=j+1; continue
    }
    if (line[i]==='"'||line[i]==="'") {
      const q=line[i]; let j=i+1
      while(j<line.length&&line[j]!==q){if(line[j]==='\\')j++;j++}
      result+=`<span class="tok-string">${line.slice(i,j+1)}</span>`; i=j+1; continue
    }
    if (/[a-zA-Z_]/.test(line[i])) {
      let j=i; while(j<line.length&&/[a-zA-Z0-9_]/.test(line[j]))j++
      const word=line.slice(i,j)
      const isCall=line.slice(j).trimStart()[0]==='('
      if(KEYWORDS.has(word))       result+=`<span class="tok-keyword">${word}</span>`
      else if(BUILTINS.has(word))  result+=`<span class="tok-builtin">${word}</span>`
      else if(/^[A-Z]/.test(word)) result+=`<span class="tok-classname">${word}</span>`
      else if(isCall)              result+=`<span class="tok-funcname">${word}</span>`
      else                         result+=word
      i=j; continue
    }
    if (/[0-9]/.test(line[i])) {
      let j=i; while(j<line.length&&/[0-9._xXa-fA-F]/.test(line[j]))j++
      result+=`<span class="tok-number">${line.slice(i,j)}</span>`; i=j; continue
    }
    result+=line[i]; i++
  }
  return result
}

// ── JAVASCRIPT / TYPESCRIPT ────────────────────────────────────
function highlightJS(line) {
  if (/^\s*\/\//.test(line)) return `<span class="tok-comment">${line}</span>`
  let result='', i=0
  const KEYWORDS = new Set(['const','let','var','function','return','if','else','for','while',
    'do','switch','case','break','continue','new','delete','typeof','instanceof','in','of',
    'try','catch','finally','throw','class','extends','import','export','default','async',
    'await','yield','this','super','static','from','null','undefined','true','false',
    'interface','type','enum','implements','readonly','declare','abstract','keyof','as'])
  const BUILTINS = new Set(['console','document','window','Array','Object','String','Number',
    'Boolean','Promise','JSON','Math','Date','fetch','setTimeout','setInterval','parseInt',
    'parseFloat','isNaN','Map','Set','Error'])
  while (i < line.length) {
    if (line[i]==='/'&&line[i+1]==='/') { result+=`<span class="tok-comment">${line.slice(i)}</span>`; break }
    if (line[i]==='`') {
      let j=i+1; while(j<line.length&&line[j]!=='`'){if(line[j]==='\\')j++;j++}
      result+=`<span class="tok-string">${line.slice(i,j+1)}</span>`; i=j+1; continue
    }
    if (line[i]==='"'||line[i]==="'") {
      const q=line[i]; let j=i+1
      while(j<line.length&&line[j]!==q){if(line[j]==='\\')j++;j++}
      result+=`<span class="tok-string">${line.slice(i,j+1)}</span>`; i=j+1; continue
    }
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j=i; while(j<line.length&&/[a-zA-Z0-9_$]/.test(line[j]))j++
      const word=line.slice(i,j)
      const isCall=line.slice(j).trimStart()[0]==='('
      if(KEYWORDS.has(word))       result+=`<span class="tok-keyword">${word}</span>`
      else if(BUILTINS.has(word))  result+=`<span class="tok-builtin">${word}</span>`
      else if(/^[A-Z]/.test(word)) result+=`<span class="tok-classname">${word}</span>`
      else if(isCall)              result+=`<span class="tok-funcname">${word}</span>`
      else                         result+=word
      i=j; continue
    }
    if (/[0-9]/.test(line[i])) {
      let j=i; while(j<line.length&&/[0-9._]/.test(line[j]))j++
      result+=`<span class="tok-number">${line.slice(i,j)}</span>`; i=j; continue
    }
    result+=line[i]; i++
  }
  return result
}

// ── HTML ──────────────────────────────────────────────────────
function highlightHTML(line) {
  return line
    .replace(/(<!--.*?-->)/g, '<span class="tok-comment">$1</span>')
    .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tok-keyword">$2</span>')
    .replace(/([\w-]+)(=)(&quot;[^&]*&quot;)/g, '<span class="tok-builtin">$1</span>$2<span class="tok-string">$3</span>')
}

// ── CSS ───────────────────────────────────────────────────────
function highlightCSS(line) {
  if (/^\s*\/\*/.test(line)) return `<span class="tok-comment">${line}</span>`
  return line
    .replace(/(--[\w-]+)/g, '<span class="tok-variable">$1</span>')
    .replace(/(@[\w-]+)/g, '<span class="tok-keyword">$1</span>')
    .replace(/([.#][\w-]+)/g, '<span class="tok-classname">$1</span>')
    .replace(/(#[0-9a-fA-F]{3,8})\b/g, '<span class="tok-number">$1</span>')
    .replace(/\b(\d+\.?\d*(?:px|em|rem|vh|vw|%|s|ms|deg)?)\b/g, '<span class="tok-number">$1</span>')
}

// ── JAVA ──────────────────────────────────────────────────────
function highlightJava(line) {
  if (/^\s*\/\//.test(line)) return `<span class="tok-comment">${line}</span>`
  return line
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="tok-string">$1</span>')
    .replace(/\b(public|private|protected|static|final|abstract|class|interface|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package|void|int|long|double|float|boolean|char|byte|short|null|true|false|this|super|instanceof|enum)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="tok-classname">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-number">$1</span>')
}

// ── C++ ───────────────────────────────────────────────────────
function highlightCPP(line) {
  if (/^\s*\/\//.test(line)) return `<span class="tok-comment">${line}</span>`
  if (/^\s*#/.test(line)) return `<span class="tok-decorator">${line}</span>`
  return line
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="tok-string">$1</span>')
    .replace(/\b(int|long|short|char|float|double|bool|void|auto|const|static|struct|class|public|private|protected|return|if|else|for|while|do|switch|case|break|continue|new|delete|namespace|using|template|typename|virtual|override|nullptr|true|false)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/\b(std|cout|cin|endl|string|vector|map|set|push_back)\b/g, '<span class="tok-builtin">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-number">$1</span>')
}

// ── SQL ───────────────────────────────────────────────────────
function highlightSQL(line) {
  if (/^\s*--/.test(line)) return `<span class="tok-comment">${line}</span>`
  return line
    .replace(/('(?:[^'\\]|\\.)*')/g, '<span class="tok-string">$1</span>')
    .replace(/\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|JOIN|LEFT|RIGHT|INNER|ON|AS|AND|OR|NOT|IN|LIKE|ORDER|BY|GROUP|HAVING|LIMIT|COUNT|SUM|AVG|MIN|MAX|NULL|PRIMARY|KEY)\b/gi, '<span class="tok-keyword">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-number">$1</span>')
}

// ─────────────────────────────────────────────────────────────
// PARTICLES
// ─────────────────────────────────────────────────────────────

const container = document.getElementById('particles')
for (let i = 0; i < 40; i++) {
  const p = document.createElement('div')
  p.className = 'particle'
  p.style.left = Math.random() * 100 + 'vw'
  p.style.animationDuration = (6 + Math.random() * 12) + 's'
  p.style.animationDelay    = (Math.random() * 10) + 's'
  p.style.width = p.style.height = (Math.random() > 0.7 ? '3px' : '2px')
  if (Math.random() > 0.6) p.style.background = '#ff00aa'
  if (Math.random() > 0.8) p.style.background = '#00ff88'
  container.appendChild(p)
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

document.getElementById('initTime').textContent =
  new Date().toLocaleTimeString('en-US', { hour12: false })

document.getElementById('launchBtn').addEventListener('click', () => {
  document.getElementById('landing').classList.add('fade-out')
  setTimeout(() => {
    document.getElementById('landing').style.display = 'none'
    document.getElementById('app').classList.remove('hidden')
  }, 800)
})

// ─────────────────────────────────────────────────────────────
// TAB SWITCHING
// ─────────────────────────────────────────────────────────────

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
    btn.classList.add('active')
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active')
  })
})

// ─────────────────────────────────────────────────────────────
// CODE EDITOR + HIGHLIGHT OVERLAY
// ─────────────────────────────────────────────────────────────

const codeEditor    = document.getElementById('codeEditor')
const lineNumbers   = document.getElementById('lineNumbers')
const lineCount     = document.getElementById('lineCount')
const codeHighlight = document.getElementById('codeHighlight')


function updateHighlight() {
  const code = codeEditor.value
  const lang = document.getElementById('langSelect').value
  codeHighlight.innerHTML  = highlight(code, lang) + '\n'
  codeHighlight.scrollTop  = codeEditor.scrollTop
  codeHighlight.scrollLeft = codeEditor.scrollLeft
}

function updateLineNumbers() {
  const lines = codeEditor.value.split('\n').length
  lineNumbers.textContent = Array.from({length: lines}, (_, i) => i + 1).join('\n')
  lineCount.textContent   = lines + ' line' + (lines !== 1 ? 's' : '')
  lineNumbers.scrollTop   = codeEditor.scrollTop
}

codeEditor.addEventListener('input', () => { updateHighlight(); updateLineNumbers() })

codeEditor.addEventListener('scroll', () => {
  lineNumbers.scrollTop    = codeEditor.scrollTop
  codeHighlight.scrollTop   = codeEditor.scrollTop
  codeHighlight.scrollLeft  = codeEditor.scrollLeft
})

document.getElementById('langSelect').addEventListener('change', updateHighlight)

codeEditor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault()
    const s = codeEditor.selectionStart, end = codeEditor.selectionEnd
    codeEditor.value = codeEditor.value.substring(0,s) + '  ' + codeEditor.value.substring(end)
    codeEditor.selectionStart = codeEditor.selectionEnd = s + 2
    updateHighlight(); updateLineNumbers()
  }
})

document.getElementById('clearCode').addEventListener('click', () => {
  codeEditor.value        = ''
  codeHighlight.innerHTML  = ''
  updateLineNumbers()
  document.getElementById('outputEmpty').classList.remove('hidden')
  document.getElementById('copilotResult').classList.add('hidden')
  document.getElementById('copilotLoader').classList.add('hidden')
  document.getElementById('askAnswer').classList.add('hidden')
})

// ─────────────────────────────────────────────────────────────
// CODE REVIEW
// ─────────────────────────────────────────────────────────────

document.getElementById('reviewBtn').addEventListener('click', async () => {
  const code = codeEditor.value.trim()
  const lang = document.getElementById('langSelect').value
  if (!code) return
  document.getElementById('outputEmpty').classList.add('hidden')
  document.getElementById('copilotResult').classList.add('hidden')
  document.getElementById('copilotLoader').classList.remove('hidden')
  try {
    const res  = await fetch('/review', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({code,lang}) })
    const data = await res.json()
    const badgeRow = document.getElementById('badgeRow')
    badgeRow.innerHTML = ''
    if (data.badges && data.badges.length) {
      data.badges.forEach(b => {
        const span = document.createElement('span')
        span.className = `badge ${b.type}`; span.textContent = b.label
        badgeRow.appendChild(span)
      })
    }
    document.getElementById('reviewBody').textContent = data.review || data.error
    document.getElementById('copilotResult').classList.remove('hidden')
  } catch(e) {
    document.getElementById('reviewBody').textContent = 'ERROR: ' + e.message
    document.getElementById('copilotResult').classList.remove('hidden')
  } finally {
    document.getElementById('copilotLoader').classList.add('hidden')
  }
})

document.getElementById('copyReview').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('reviewBody').textContent)
  document.getElementById('copyReview').textContent = '[ COPIED ✓ ]'
  setTimeout(() => document.getElementById('copyReview').textContent = '[ COPY ]', 2000)
})

// ─────────────────────────────────────────────────────────────
// ASK ABOUT CODE
// ─────────────────────────────────────────────────────────────

document.getElementById('askBtn').addEventListener('click', async () => {
  const question = document.getElementById('askInput').value.trim()
  const code     = codeEditor.value.trim()
  const lang     = document.getElementById('langSelect').value
  if (!question) return
  const answerEl = document.getElementById('askAnswer')
  answerEl.textContent = 'PROCESSING…'; answerEl.classList.remove('hidden')
  try {
    const res  = await fetch('/ask', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({question,code,lang}) })
    const data = await res.json()
    answerEl.textContent = data.answer || data.error
  } catch(e) { answerEl.textContent = 'ERROR: ' + e.message }
})

document.getElementById('askInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('askBtn').click()
})

// ─────────────────────────────────────────────────────────────
// CHAT
// ─────────────────────────────────────────────────────────────

const chatWindow = document.getElementById('chatWindow')
const chatInput  = document.getElementById('chatInput')

function addMsg(text, role) {
  const label = role === 'ai' ? 'CODE-AGENT' : 'USER'
  const div   = document.createElement('div')
  div.className = `chat-msg ${role}`
  div.innerHTML = `<div class="msg-label">${label}</div><div class="msg-body">${text}</div><div class="msg-time">${new Date().toLocaleTimeString('en-US',{hour12:false})}</div>`
  chatWindow.appendChild(div); chatWindow.scrollTop = chatWindow.scrollHeight
  return div
}

async function sendChat() {
  const msg = chatInput.value.trim(); if(!msg) return
  addMsg(msg,'user'); chatInput.value=''
  const aiDiv = addMsg('PROCESSING…','ai')
  try {
    const res  = await fetch('/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:msg}) })
    const data = await res.json()
    aiDiv.querySelector('.msg-body').textContent = data.response || data.error
  } catch(e) { aiDiv.querySelector('.msg-body').textContent = 'ERROR: '+e.message }
}

document.getElementById('chatSend').addEventListener('click', sendChat)
chatInput.addEventListener('keydown', e => { if(e.key==='Enter') sendChat() })

// ─────────────────────────────────────────────────────────────
// RESEARCH
// ─────────────────────────────────────────────────────────────

document.getElementById('researchBtn').addEventListener('click', async () => {
  const topic = document.getElementById('researchInput').value.trim(); if(!topic) return
  document.getElementById('researchLoader').classList.remove('hidden')
  document.getElementById('researchResult').classList.add('hidden')
  try {
    const res  = await fetch('/research', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({topic}) })
    const data = await res.json()
    document.getElementById('researchOutput').textContent = data.report || data.error
    document.getElementById('researchResult').classList.remove('hidden')
  } catch(e) { alert('ERROR: '+e.message) }
  finally { document.getElementById('researchLoader').classList.add('hidden') }
})

document.getElementById('copyReport').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('researchOutput').textContent)
  document.getElementById('copyReport').textContent = '[ COPIED ✓ ]'
  setTimeout(() => document.getElementById('copyReport').textContent = '[ COPY ]', 2000)
})

// ─────────────────────────────────────────────────────────────
// TEXT TO SPEECH
// ─────────────────────────────────────────────────────────────

const ttsText = document.getElementById('ttsText')
ttsText.addEventListener('input', () => {
  document.getElementById('charCount').textContent = `${ttsText.value.length} / 4500`
})

let selectedVoice = 'en-US-Studio-O'
document.querySelectorAll('.voice-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.voice-chip').forEach(c => c.classList.remove('active'))
    chip.classList.add('active'); selectedVoice = chip.dataset.voice
  })
})

document.getElementById('ttsBtn').addEventListener('click', async () => {
  const text = ttsText.value.trim(); if(!text) return
  document.getElementById('ttsLoader').classList.remove('hidden')
  document.getElementById('ttsPlayer').classList.add('hidden')
  try {
    const res  = await fetch('/speak', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text,voice_id:selectedVoice}) })
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    document.getElementById('ttsAudio').src    = url
    document.getElementById('ttsDownload').href = url
    document.getElementById('ttsPlayer').classList.remove('hidden')
  } catch(e) { alert('ERROR: '+e.message) }
  finally { document.getElementById('ttsLoader').classList.add('hidden') }
})