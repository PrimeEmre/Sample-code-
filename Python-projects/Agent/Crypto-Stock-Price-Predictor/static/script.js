// ── CLOCK ─────────────────────────────────────────────────────
function tick() {
  const now = new Date()
  document.getElementById('hdrClock').textContent =
    now.toLocaleTimeString('en-US', { hour12: false })
  document.getElementById('hdrDate').textContent =
    now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()
}
tick()
setInterval(tick, 1000)

// ── REFS ──────────────────────────────────────────────────────
const tickerInput  = document.getElementById('tickerInput')
const analyzeBtn   = document.getElementById('analyzeBtn')
const homeScreen   = document.getElementById('homeScreen')
const loadScreen   = document.getElementById('loadScreen')
const errScreen    = document.getElementById('errScreen')
const resultScreen = document.getElementById('resultScreen')
const loadTicker   = document.getElementById('loadTicker')
const loadStep     = document.getElementById('loadStep')

// ── SNAP CARDS ────────────────────────────────────────────────
document.querySelectorAll('.snap-card').forEach(card => {
  card.addEventListener('click', () => {
    tickerInput.value = card.dataset.ticker
    analyze()
  })
})

// ── POP CHIPS ─────────────────────────────────────────────────
document.querySelectorAll('.pop-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    tickerInput.value = chip.dataset.ticker
    analyze()
  })
})

// ── TRIGGERS ─────────────────────────────────────────────────
analyzeBtn.addEventListener('click', analyze)
tickerInput.addEventListener('keydown', e => { if (e.key === 'Enter') analyze() })

document.getElementById('retryBtn').addEventListener('click', () => {
  errScreen.classList.add('hidden')
  homeScreen.classList.remove('hidden')
  tickerInput.value = ''
  tickerInput.focus()
})

document.getElementById('newBtn').addEventListener('click', () => {
  resultScreen.classList.add('hidden')
  homeScreen.classList.remove('hidden')
  tickerInput.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
  setTimeout(() => tickerInput.focus(), 300)
})

// ── ANALYZE ───────────────────────────────────────────────────
async function analyze() {
  const ticker = tickerInput.value.trim().toUpperCase()
  if (!ticker) { tickerInput.focus(); return }

  homeScreen.classList.add('hidden')
  errScreen.classList.add('hidden')
  resultScreen.classList.add('hidden')
  loadScreen.classList.remove('hidden')
  loadTicker.textContent = ticker

  const steps = [
    'Connecting to market data feeds...',
    `Retrieving ${ticker} price history...`,
    'Fetching 6-month performance data...',
    'Scanning financial news...',
    'Running AI analysis engine...',
    'Generating investment report...'
  ]
  let si = 0
  loadStep.textContent = steps[0]
  const stepTimer = setInterval(() => {
    if (si < steps.length - 1) loadStep.textContent = steps[++si]
  }, 2000)

  try {
    const res  = await fetch('/stock', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ticker })
    })
    const data = await res.json()

    clearInterval(stepTimer)
    loadScreen.classList.add('hidden')

    if (data.error) {
      document.getElementById('errMsg').textContent = data.error
      errScreen.classList.remove('hidden')
      return
    }

    renderResult(data)
    resultScreen.classList.remove('hidden')
    window.scrollTo({ top: 0, behavior: 'smooth' })

  } catch (e) {
    clearInterval(stepTimer)
    loadScreen.classList.add('hidden')
    document.getElementById('errMsg').textContent = 'Network error: ' + e.message
    errScreen.classList.remove('hidden')
  }
}

// ── RENDER ────────────────────────────────────────────────────
function renderResult(data) {
  const report = data.report || ''
  const lower  = report.toLowerCase()

  // Identity
  set('rTicker',  data.ticker  || '—')
  set('rCompany', data.company || '—')
  set('rMeta',    [data.sector, data.industry].filter(x => x && x !== 'N/A').join(' · ') || 'Equity')
  set('rCurrency', data.currency === 'USD' ? '$' : (data.currency || '$'))

  // Price
  set('rPrice', fmtPrice(data.price))

  // 1-month change badge
  renderChangeBadge('rChange', data.change_1m, '1M')

  // Performance row — 1M, 3M, 6M
  renderPerfRow(data)

  // Verdict
  const vEl = document.getElementById('rVerdictVal')
  const rat  = (data.analyst_rating || '').toLowerCase()
  if (rat.includes('strong_buy') || rat.includes('strongbuy')) {
    vEl.textContent = 'STRONG BUY'; vEl.className = 'rv-val buy'
  } else if (rat.includes('buy') || lower.includes('strong buy')) {
    vEl.textContent = 'BUY'; vEl.className = 'rv-val buy'
  } else if (rat.includes('sell') || lower.includes('sell')) {
    vEl.textContent = 'SELL'; vEl.className = 'rv-val sell'
  } else {
    vEl.textContent = 'HOLD'; vEl.className = 'rv-val hold'
  }

  // Metrics — ALL from server now, not extracted from report text
  set('rMktCap',  data.market_cap    || '—')
  set('rPE',      data.pe_ratio      || '—')
  set('rFwdPE',   data.forward_pe    || '—')
  set('rDiv',     data.dividend      || '—')
  set('rBeta',    data.beta          || '—')
  set('rVol',     data.avg_volume    || '—')
  set('rTarget',  data.target        || '—')
  set('rRating',  data.analyst_rating|| '—')

  // 52-week range
  set('r52Low',  data.w52_low  || '—')
  set('r52High', data.w52_high || '—')

  // Position the range dot based on current price vs 52w range
  if (data.w52_low_raw && data.w52_high_raw && data.price) {
    const lo  = parseFloat(data.w52_low_raw)
    const hi  = parseFloat(data.w52_high_raw)
    const cur = parseFloat(data.price)
    if (hi > lo) {
      const pct = Math.min(Math.max(((cur - lo) / (hi - lo)) * 100, 3), 97)
      document.getElementById('rngDot').style.left = pct + '%'
    }
  }

  // Monthly performance mini chart
  if (data.monthly_closes && Object.keys(data.monthly_closes).length > 0) {
    drawMiniChart(data.monthly_closes)
  }

  // Report
  document.getElementById('rReport').textContent = report

  // Saved
  if (data.saved_to) set('rSaved', 'Saved: ' + data.saved_to)
}

// ── CHANGE BADGE ──────────────────────────────────────────────
function renderChangeBadge(elId, pct, period) {
  const el = document.getElementById(elId)
  if (!el) return
  if (pct == null || isNaN(parseFloat(pct))) {
    el.textContent = '— (' + period + ')'
    el.className = 'rh-change flat'
    return
  }
  const n    = parseFloat(pct)
  const sign = n >= 0 ? '+' : ''
  el.textContent = sign + n.toFixed(2) + '% (' + period + ')'
  el.className   = 'rh-change ' + (n > 0 ? 'up' : n < 0 ? 'dn' : 'flat')
}

// ── PERFORMANCE ROW (1M / 3M / 6M) ───────────────────────────
function renderPerfRow(data) {
  const container = document.getElementById('perfRow')
  if (!container) return

  const periods = [
    { label: '1 MONTH',  val: data.change_1m },
    { label: '3 MONTHS', val: data.change_3m },
    { label: '6 MONTHS', val: data.change_6m },
  ]

  container.innerHTML = periods.map(p => {
    const n     = parseFloat(p.val)
    const valid = !isNaN(n)
    const sign  = valid && n >= 0 ? '+' : ''
    const cls   = valid ? (n >= 0 ? 'up' : 'dn') : 'flat'
    const disp  = valid ? sign + n.toFixed(2) + '%' : '—'
    return `
      <div class="perf-item">
        <div class="perf-label">${p.label}</div>
        <div class="perf-val ${cls}">${disp}</div>
      </div>`
  }).join('')
}

// ── MINI CHART ────────────────────────────────────────────────
function drawMiniChart(monthlyCloses) {
  const canvas = document.getElementById('miniChart')
  if (!canvas) return

  const ctx    = canvas.getContext('2d')
  const labels = Object.keys(monthlyCloses)
  const values = Object.values(monthlyCloses)

  if (values.length < 2) return

  const W   = canvas.width
  const H   = canvas.height
  const pad = { top: 16, right: 12, bottom: 28, left: 48 }

  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const rng  = maxV - minV || 1

  const xStep = (W - pad.left - pad.right)  / (values.length - 1)
  const yScale = (H - pad.top - pad.bottom) / rng

  const toX = i => pad.left + i * xStep
  const toY = v => H - pad.bottom - (v - minV) * yScale

  // Background
  ctx.clearRect(0, 0, W, H)

  // Gradient fill
  const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom)
  const isUp = values[values.length - 1] >= values[0]
  if (isUp) {
    grad.addColorStop(0, 'rgba(38,194,129,0.3)')
    grad.addColorStop(1, 'rgba(38,194,129,0.02)')
  } else {
    grad.addColorStop(0, 'rgba(232,64,85,0.3)')
    grad.addColorStop(1, 'rgba(232,64,85,0.02)')
  }

  ctx.beginPath()
  ctx.moveTo(toX(0), toY(values[0]))
  for (let i = 1; i < values.length; i++) {
    ctx.lineTo(toX(i), toY(values[i]))
  }
  ctx.lineTo(toX(values.length - 1), H - pad.bottom)
  ctx.lineTo(toX(0), H - pad.bottom)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill()

  // Line
  ctx.beginPath()
  ctx.moveTo(toX(0), toY(values[0]))
  for (let i = 1; i < values.length; i++) {
    ctx.lineTo(toX(i), toY(values[i]))
  }
  ctx.strokeStyle = isUp ? '#26c281' : '#e84055'
  ctx.lineWidth   = 2
  ctx.lineJoin    = 'round'
  ctx.stroke()

  // Dots at each point
  for (let i = 0; i < values.length; i++) {
    ctx.beginPath()
    ctx.arc(toX(i), toY(values[i]), 3, 0, Math.PI * 2)
    ctx.fillStyle   = isUp ? '#26c281' : '#e84055'
    ctx.fill()
  }

  // X labels (month names)
  ctx.fillStyle  = '#545870'
  ctx.font       = '10px Inter, sans-serif'
  ctx.textAlign  = 'center'
  for (let i = 0; i < labels.length; i++) {
    const shortLabel = labels[i].split(' ')[0] // Just "Jan", "Feb" etc
    ctx.fillText(shortLabel, toX(i), H - 6)
  }

  // Y labels (price)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#545870'
  const yTicks  = 4
  for (let t = 0; t <= yTicks; t++) {
    const v = minV + (rng / yTicks) * t
    const y = toY(v)
    ctx.fillText('$' + v.toFixed(0), pad.left - 4, y + 3)
    // Grid line
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(W - pad.right, y)
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth   = 1
    ctx.stroke()
  }
}

// ── COPY ──────────────────────────────────────────────────────
document.getElementById('copyBtn').addEventListener('click', () => {
  const text = document.getElementById('rReport').textContent
  if (!text || text === '—') return
  navigator.clipboard.writeText(text)
  const btn = document.getElementById('copyBtn')
  btn.textContent = 'Copied ✓'
  setTimeout(() => btn.textContent = 'Copy Report', 2000)
})

// ── HELPERS ───────────────────────────────────────────────────
function set(id, val) {
  const el = document.getElementById(id)
  if (el) el.textContent = val
}

function fmtPrice(p) {
  if (p == null) return '—'
  const n = parseFloat(p)
  if (isNaN(n)) return '—'
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}