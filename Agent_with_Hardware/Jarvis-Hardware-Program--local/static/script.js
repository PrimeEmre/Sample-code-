// --- DOM Elements ---
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const manualTtsInput = document.getElementById('manual-tts-input');
const manualSpeakBtn = document.getElementById('manual-speak-btn');

const orb = document.getElementById('main-orb');
const statusText = document.getElementById('status-text');
const subStatusText = document.getElementById('sub-status-text');

const pin12 = document.getElementById('pin-12');
const pin13 = document.getElementById('pin-13');
const relay1 = document.getElementById('relay-1');

// --- Global TTS Function ---
// Made global so the HTML onclick can call it directly for the first message.
// Voice synthesis runs through OmniVoice Studio (local, OpenAI-compatible TTS
// server) via the /tts backend route, instead of the browser's speechSynthesis.
let currentAudio = null;
let speakRequestId = 0;

async function speakText(text) {
    const cleanText = text.replace(/\*/g, '');
    if (!cleanText) return;

    // Claim this call as the authoritative one and stop whatever's already
    // playing. Generation takes several seconds, so if speakText() gets
    // called again before this call's fetch resolves (e.g. auto-play on
    // load overlapping a manual speaker click), the requestId check below
    // makes the earlier call drop its result instead of also playing --
    // otherwise both would end up playing at once, overlapping out of sync.
    const requestId = ++speakRequestId;
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    // Voice synthesis on this hardware can take several seconds -- show
    // visible feedback so it doesn't look hung.
    const previousSubStatus = subStatusText.textContent;
    subStatusText.textContent = 'Synthesizing voice...';

    try {
        const resp = await fetch('/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: cleanText }),
        });
        if (!resp.ok) {
            const data = await resp.json().catch(() => ({}));
            throw new Error(data.error || `TTS request failed (${resp.status})`);
        }
        const blob = await resp.blob();
        if (requestId !== speakRequestId) return; // superseded by a newer call
        currentAudio = new Audio(URL.createObjectURL(blob));
        currentAudio.play().catch(() => {}); // autoplay may be blocked before user interaction
    } catch (err) {
        console.error('Voice synthesis failed:', err);
    } finally {
        if (requestId === speakRequestId) {
            subStatusText.textContent = previousSubStatus;
        }
    }
}

// --- Manual TTS Sidebar Button ---
manualSpeakBtn.addEventListener('click', () => {
    const text = manualTtsInput.value.trim();
    if(text) {
        speakText(text);
    }
});

// --- Hardware State Management ---
function setHardwareState(state) {
    orb.classList.remove('orb-idle', 'orb-researching', 'orb-debating', 'orb-complete');
    pin12.classList.remove('active-blue');
    pin13.classList.remove('active-yellow');
    relay1.classList.remove('active-white');

    switch(state) {
        case 'researching':
            orb.classList.add('orb-researching');
            pin12.classList.add('active-blue');
            statusText.textContent = 'RESEARCHING';
            subStatusText.textContent = 'Agents gathering data...';
            break;
        case 'debating':
            orb.classList.add('orb-debating');
            pin13.classList.add('active-yellow');
            statusText.textContent = 'DEBATING';
            subStatusText.textContent = 'Agents evaluating options...';
            break;
        case 'complete':
            orb.classList.add('orb-complete');
            relay1.classList.add('active-white');
            statusText.textContent = 'TASK COMPLETE';
            subStatusText.textContent = 'Ready for next command.';
            break;
        default:
            orb.classList.add('orb-idle');
            statusText.textContent = 'STANDBY';
            subStatusText.textContent = 'System Idle';
    }
}

// --- Chat Logic ---
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.innerText = text; 
    
    // If it's from Jarvis, add the explicit Speak button
    if(sender === 'jarvis') {
        const speakBtn = document.createElement('button');
        speakBtn.classList.add('inline-speak-btn');
        speakBtn.innerText = '🔊';
        speakBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            speakText(text);
        });
        contentDiv.appendChild(speakBtn);
    }
    
    messageDiv.appendChild(contentDiv);
    chatLog.appendChild(messageDiv);
    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: "smooth" });
}

// --- SocketIO: live hardware state pushed from the backend ---
const socket = io();
socket.on('status_update', (data) => setHardwareState(data.state));

async function fetchJarvisResponse(userText) {
    const resp = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
    });

    const data = await resp.json();
    if (!resp.ok) {
        throw new Error(data.error || `Request failed (${resp.status})`);
    }
    return data.reply;
}

const defaultInputPlaceholder = userInput.placeholder;

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    sendBtn.disabled = true;
    userInput.disabled = true;
    userInput.placeholder = 'Jarvis is responding...';

    try {
        const response = await fetchJarvisResponse(text);
        addMessage(response, 'jarvis');
    } catch (err) {
        addMessage(`Apologies, I encountered an error: ${err.message}`, 'jarvis');
    } finally {
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.placeholder = defaultInputPlaceholder;
        userInput.focus();
    }
}

// Event Listeners
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

setHardwareState('idle');

// --- Boot greeting: speak the initial message once the page loads.
// Best effort -- browsers may block audio autoplay until the user has
// interacted with the page, so a failure here is silently ignored.
function getBootGreetingText() {
    const greetingEl = document.querySelector('#chat-log .message-content');
    if (!greetingEl) return '';
    const clone = greetingEl.cloneNode(true);
    clone.querySelector('.inline-speak-btn')?.remove();
    return clone.textContent.trim();
}

document.querySelector('#chat-log .inline-speak-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const greetingText = getBootGreetingText();
    if (greetingText) speakText(greetingText);
});

window.addEventListener('load', () => {
    const greetingText = getBootGreetingText();
    if (greetingText) speakText(greetingText);
});