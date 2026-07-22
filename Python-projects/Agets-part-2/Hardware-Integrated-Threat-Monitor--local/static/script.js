const state = {
    signalsSent: 0,
    alertsOn: true
};

const $ = (id) => document.getElementById(id);
const threatList = $('threatList');
const serialOutput = $('serialOutput');
const lcdScreen = $('lcdScreen');
const ledStrip = $('ledStrip');
const overlay = $('criticalOverlay');

function init() {
    buildLedStrip();
    startClock();
    startBackgroundCanvas();
    setLedState('standby');
    attachControls();
    startSerialIdle();
}

function buildLedStrip() {
    ledStrip.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const led = document.createElement('div');
        led.className = 'led';
        ledStrip.appendChild(led);
    }
}

function setLedState(mode) {
    const leds = ledStrip.querySelectorAll('.led');
    const ledState = $('ledState');
    
    if (mode === 'alert') {
        ledState.textContent = 'ALERT · RED';
        ledState.classList.add('alert');
        leds.forEach((led, i) => {
            setTimeout(() => {
                led.classList.remove('on');
                led.classList.add('alert');
            }, i * 25);
        });
    } else if (mode === 'standby') {
        ledState.textContent = 'STANDBY';
        ledState.classList.remove('alert');
        leds.forEach((led, i) => {
            led.classList.remove('alert', 'on');
            if (i % 5 === 0) led.classList.add('on');
        });
    }
}

function setLCD(line1, line2, alert = false) {
    $('lcdRow1').textContent = line1;
    $('lcdRow2').textContent = line2;
    lcdScreen.classList.toggle('alert', alert);
}

function startClock() {
    const update = () => {
        const now = new Date();
        $('clock').textContent = now.toLocaleTimeString('en-US', { hour12: false });
    };
    update();
    setInterval(update, 1000);
}

function appendSerial(text, cls = '') {
    const line = document.createElement('div');
    line.className = `serial-line ${cls}`;
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
    line.innerHTML = `<span class="ts">[${ts}]</span> ${text}`;
    serialOutput.appendChild(line);
    serialOutput.scrollTop = serialOutput.scrollHeight;
}

function startSerialIdle() {
    const idleMessages = [
        '> Polling CrewAI pipeline...', '< HEARTBEAT: OK', '> Serial buffer: 0/64 bytes'
    ];
    let idx = 0;
    setInterval(() => {
        if (!lcdScreen.classList.contains('alert')) {
            appendSerial(idleMessages[idx % idleMessages.length]);
            idx++;
        }
    }, 4000);
}

// Trigger Arduino UI visuals
function triggerHardwareUI() {
    if (state.alertsOn) {
        $('overlayThreatName').textContent = "CRITICAL";
        overlay.classList.add('active');
        setTimeout(() => overlay.classList.remove('active'), 3500);
    }
    
    setLCD('CRITICAL THREAT', 'ZERO-DAY ALERT!', true);
    setLedState('alert');
    $('boardLed13').classList.add('l-active');
    ['flowPulse1', 'flowPulse2', 'flowPulse3'].forEach(id => $(id).classList.add('flowing'));
    
    appendSerial(`> DISPATCHING SIGNAL TO ARDUINO...`, 'critical');
    appendSerial(`> TX: C  // CRITICAL FLAG`, 'critical');
    
    state.signalsSent++;
    $('signalCount').textContent = String(state.signalsSent).padStart(3, '0');
}

function resetHardwareUI() {
    setLCD('SENTINEL v2.4 READY', 'MONITORING...', false);
    setLedState('standby');
    $('boardLed13').classList.remove('l-active');
    overlay.classList.remove('active');
    ['flowPulse1', 'flowPulse2', 'flowPulse3'].forEach(id => $(id).classList.remove('flowing'));
    appendSerial(`> MANUAL RESET. System Nominal.`);
}

// ====== PYTHON BACKEND CONNECTIONS ======

async function generateBriefing() {
    const topic = $('topicInput').value.trim();
    if (!topic) { alert("Please enter a topic"); return; }
    
    threatList.innerHTML = '<div class="empty-state"><div class="loader-spinner"></div><p>AI is generating briefing...</p></div>';
    appendSerial(`> POST /generate-briefing : Topic="${topic}"`);
    
    try {
        const res = await fetch('/generate-briefing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to generate');
        
        // Render Markdown
        const parsedHtml = marked.parse(data.newsletter);
        threatList.innerHTML = `<div class="markdown-content">${parsedHtml}</div>`;
        $('outputMeta').textContent = `Source: ${data.source} | ${data.cached ? 'CACHED' : 'FRESH'}`;
        
        appendSerial(`< ACK: Briefing received from ${data.source}`);
        
        // The Python backend already sent the signal to Arduino. 
        // We just update the UI to match what the hardware is doing.
        // We search the original text for the CRITICAL tag (before python stripped it)
        // Note: Since Python strips it, we trigger UI alert if the source text implies critical.
        // For simplicity, we trigger the red UI if the AI mentions "Critical" heavily.
        if (data.newsletter.includes("🔴 Critical") || data.newsletter.includes("CRITICAL")) {
             triggerHardwareUI();
             setTimeout(() => resetHardwareUI(), 4500);
        } else {
             resetHardwareUI();
        }

    } catch (err) {
        threatList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-exclamation" style="color:red"></i><p style="color:red">${err.message}</p></div>`;
        appendSerial(`❌ ERROR: ${err.message}`, 'critical');
    }
}

async function testHardware() {
    appendSerial(`> GET /api/test-hardware`);
    try {
        const res = await fetch('/api/test-hardware');
        const data = await res.json();
        if (data.status === 'success') {
            triggerHardwareUI();
            setTimeout(() => resetHardwareUI(), 4500);
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert("Failed to test hardware. Is Python running?");
    }
}

function attachControls() {
    $('btnGenerate').addEventListener('click', generateBriefing);
    $('btnTestHW').addEventListener('click', testHardware);
    $('btnReset').addEventListener('click', resetHardwareUI);
}

function startBackgroundCanvas() {
    const canvas = $('bgCanvas');
    const ctx = canvas.getContext('2d');
    let w, h;
    function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
    resize(); addEventListener('resize', resize);
    const particles = [];
    for (let i = 0; i < 50; i++) particles.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, r: Math.random()*1.5+0.5 });
    function draw() {
        ctx.clearRect(0,0,w,h);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x<0||p.x>w) p.vx*=-1; if (p.y<0||p.y>h) p.vy*=-1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = 'rgba(0, 229, 255, 0.5)'; ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

window.addEventListener('DOMContentLoaded', init);