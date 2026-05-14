// ─── SYSTEM CLOCK & UPTIME ───────────────────────────────────────────────
const startTime = Date.now();

setInterval(() => {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('en-US', { hour12: false });

    const diff = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    document.getElementById('uptime').innerText = `${h}:${m}:${s}`;

    if (Math.random() > 0.7) {
        const ping = Math.floor(Math.random() * 8) + 12;
        document.getElementById('latency').innerText = `${ping}ms`;
    }
}, 1000);

document.getElementById('date').innerText = new Date()
    .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    .toUpperCase();


// ─── TICKER TAPE ─────────────────────────────────────────────────────────
const tickerData = [
    { sym: 'NVDA', p: '132.89', c: '+3.15%', up: true },
    { sym: 'AAPL', p: '224.12', c: '+1.24%', up: true },
    { sym: 'TSLA', p: '241.05', c: '-0.82%', up: false },
    { sym: 'AMD',  p: '164.20', c: '+4.02%', up: true },
    { sym: 'MSFT', p: '430.10', c: '+0.50%', up: true },
    { sym: 'META', p: '512.44', c: '-1.10%', up: false },
    { sym: 'PLTR', p: '28.50',  c: '+6.15%', up: true }
];

const track = document.getElementById('ticker-track');
[...tickerData, ...tickerData].forEach(stock => {
    const item = document.createElement('div');
    item.className = 'ticker-item';
    item.innerHTML = `
        <span class="t-sym">${stock.sym}</span>
        <span class="t-price">$${stock.p}</span>
        <span class="t-chg ${stock.up ? 'up' : 'dn'}">${stock.c}</span>
    `;
    track.appendChild(item);
});


// ─── CORE PIPELINE LOGIC ─────────────────────────────────────────────────
let analysesRun = 0;

document.getElementById('run-btn').addEventListener('click', runAnalysis);
document.getElementById('ticker-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') runAnalysis();
});

async function runAnalysis() {
    const inputEl = document.getElementById('ticker-input');
    const ticker = inputEl.value.trim().toUpperCase();
    if (!ticker) return;

    const btn = document.getElementById('run-btn');
    btn.disabled = true;
    btn.innerText = "RUNNING";
    document.getElementById('search-status').innerText = "PROCESSING";
    document.getElementById('search-status').className = "panel-badge badge-amber";
    inputEl.blur();

    resetUI(ticker);
    document.getElementById('stock-info-panel').style.display = 'block';
    document.getElementById('stock-symbol').innerText = ticker;

    let stageInterval = simulateProgress();

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticker })
        });

        const data = await response.json();
        clearInterval(stageInterval);

        // ── Surface any server-side error clearly ──
        if (!response.ok || data.error) {
            throw new Error(data.error || `Server returned ${response.status}`);
        }

        if (!data.result) {
            throw new Error("No analysis result returned from server.");
        }

        completePipeline(data.result, data.data);
        analysesRun++;
        document.getElementById('m-runs').innerText = analysesRun;

    } catch (err) {
        clearInterval(stageInterval);
        handleError(err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "ANALYZE";
        document.getElementById('search-status').innerText = "READY";
        document.getElementById('search-status').className = "panel-badge badge-green";
    }
}


// ─── UI HELPERS ──────────────────────────────────────────────────────────

function resetUI(ticker) {
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`stage-${i}`).className = "stage";
        document.getElementById(`st-${i}`).className = "stage-st st-idle";
        document.getElementById(`st-${i}`).innerText = "STANDBY";
        document.getElementById(`pf-${i}`).style.width = "0%";
        document.getElementById(`ad-${i}`).className = "agent-dot dot-idle";
    }

    document.getElementById('thesis-body').innerHTML =
        `<p class="thesis-placeholder">Engaging neural link for ${ticker}...</p>`;
    document.getElementById('thesis-footer').style.display = "none";
    document.getElementById('sb-bull').style.width = "0%";
    document.getElementById('sb-bear').style.width = "0%";
    document.getElementById('sp-bull').innerText = "0%";
    document.getElementById('sp-bear').innerText = "0%";
    document.getElementById('sentiment-score').innerText = "—";
    document.getElementById('stock-price').innerText = "$—";
    document.getElementById('stock-change').innerText = "";
    document.getElementById('stock-change').className = "price-sub";
}

function simulateProgress() {
    let currentStage = 1;

    const advanceStage = () => {
        if (currentStage > 3) return;

        if (currentStage > 1) {
            let prev = currentStage - 1;
            document.getElementById(`stage-${prev}`).className = "stage done";
            document.getElementById(`st-${prev}`).className = "stage-st st-done";
            document.getElementById(`st-${prev}`).innerText = "COMPLETED";
            document.getElementById(`pf-${prev}`).style.width = "100%";
            document.getElementById(`ad-${prev}`).className = "agent-dot dot-done";
        }

        document.getElementById(`stage-${currentStage}`).className = "stage active";
        document.getElementById(`st-${currentStage}`).className = "stage-st st-run";
        document.getElementById(`st-${currentStage}`).innerText = "RUNNING";
        document.getElementById(`pf-${currentStage}`).style.width = "65%";
        document.getElementById(`ad-${currentStage}`).className = "agent-dot dot-active";
        currentStage++;
    };

    advanceStage();
    return setInterval(advanceStage, 5000);
}

function completePipeline(result, stockData) {
    // Complete all stages
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`stage-${i}`).className = "stage done";
        document.getElementById(`st-${i}`).className = "stage-st st-done";
        document.getElementById(`st-${i}`).innerText = "COMPLETED";
        document.getElementById(`pf-${i}`).style.width = "100%";
        document.getElementById(`ad-${i}`).className = "agent-dot dot-done";
    }

    // ── Populate real stock price from data object ──
    if (stockData) {
        const price = stockData.current_price;
        const change = stockData.pct_change;

        if (price !== undefined) {
            document.getElementById('stock-price').innerText = `$${price.toLocaleString()}`;
        }
        if (change !== undefined) {
            const up = change >= 0;
            const changeEl = document.getElementById('stock-change');
            changeEl.innerText = `${up ? '+' : ''}${change.toFixed(2)}%`;
            changeEl.className = `price-sub ${up ? 'green' : 'red'}`;
        }
    }

    // ── Parse thesis text ──
    // Backend returns result.thesis (a free-text string from Ollama)
    const thesisText = result.thesis || result.thesis_summary || result.summary
        || (typeof result === 'string' ? result : JSON.stringify(result, null, 2));

    // ── Extract BUY / SELL / HOLD from the thesis text ──
    let rec = "HOLD";
    const upperThesis = thesisText.toUpperCase();
    if (upperThesis.includes("STRONG BUY") || upperThesis.match(/\bBUY\b/)) rec = "BUY";
    if (upperThesis.match(/\bSELL\b/)) rec = "SELL";
    // Explicit field overrides text-scan
    if (result.recommendation) rec = result.recommendation.toUpperCase();

    // ── Extract risk score ──
    let risk = 5;
    if (result.risk_score) {
        risk = parseInt(result.risk_score);
    } else {
        // Try to parse "Risk Score: 7" style from thesis text
        const riskMatch = thesisText.match(/risk[^\d]*(\d+)/i);
        if (riskMatch) risk = Math.min(10, Math.max(1, parseInt(riskMatch[1])));
    }

    // ── Inject Thesis ──
    document.getElementById('thesis-body').innerHTML =
        `<p>${thesisText.replace(/\n/g, '<br>')}</p>`;

    // ── Footer signal tag ──
    const footer = document.getElementById('thesis-footer');
    const signalTag = document.getElementById('signal-tag');
    footer.style.display = "flex";
    signalTag.innerText = rec;
    signalTag.classList.remove('sig-buy', 'sig-sell', 'sig-hold');

    if (rec.includes("BUY")) {
        signalTag.classList.add('sig-buy');
        document.getElementById('signal-note').innerText = "Positive convergence detected. Favorable risk-to-reward ratio.";
    } else if (rec.includes("SELL")) {
        signalTag.classList.add('sig-sell');
        document.getElementById('signal-note').innerText = "Negative divergence detected. High downside risk.";
    } else {
        signalTag.classList.add('sig-hold');
        document.getElementById('signal-note').innerText = "Market neutrality detected. Await further signals.";
    }

    // ── Sentiment bars (derived from risk score) ──
    const bearPct = Math.min(risk * 10, 100);
    const bullPct = 100 - bearPct;

    document.getElementById('sb-bull').style.width = `${bullPct}%`;
    document.getElementById('sp-bull').innerText = `${bullPct}%`;
    document.getElementById('sb-bear').style.width = `${bearPct}%`;
    document.getElementById('sp-bear').innerText = `${bearPct}%`;
    document.getElementById('sentiment-score').innerText = bullPct;

    document.getElementById('m-conf').innerText =
        Math.floor(Math.random() * (98 - 85) + 85) + "%";
}

function handleError(msg) {
    // Show a helpful hint for common ticker typos
    let hint = "";
    if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("no price data")) {
        hint = `<br><br>> HINT: Check your ticker symbol spelling.<br>> Common examples: NVDA, AAPL, MSFT, BTC-USD`;
    }

    document.getElementById('thesis-body').innerHTML =
        `<p style="color: var(--red);">> CRITICAL ERROR:<br>> ${msg}${hint}</p>`;

    for (let i = 1; i <= 3; i++) {
        document.getElementById(`stage-${i}`).className = "stage";
        document.getElementById(`pf-${i}`).style.width = "0%";
        document.getElementById(`ad-${i}`).className = "agent-dot dot-idle";
        document.getElementById(`st-${i}`).className = "stage-st st-idle";
        document.getElementById(`st-${i}`).innerText = "FAILED";
    }
}