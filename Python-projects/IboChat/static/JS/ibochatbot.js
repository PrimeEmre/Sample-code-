/*
 * Created by: Emre
 * Created on: June 2025
 * This file contains the JS for index.html
 */

/* global hljs */ // Declare hljs as a global to prevent linting errors if it's external

'use strict';

// =========================================================
// Global DOM Element Selections
// =========================================================
const chatArea = document.getElementById('chat-area');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const microphoneBtn = document.getElementById('microphoneBtn');
const toggleVoiceBtn = document.getElementById('toggle-voice-btn'); // New button for voice
const speechRecognitionStatus = document.getElementById('speechRecognitionStatus');
const btnToggle = document.getElementById('btn-toggle'); // Theme toggle button

// Sidebar elements
const newChatBtn = document.getElementById('new-chat-btn');
let chatListUl = null; // Will be assigned in DOMContentLoaded

// Audio elements (grabbed at global scope for easy access)
const audios = {
    gelsin: null, mavisim: null, tosuno: null, karauzum: null,
    leylim: null, urfaliyam: null, cakmak: null, semmame: null,
    esabini: null, maden: null
};


// =========================================================
// State & Speech Recognition Variables
// =========================================================
let recognition;
let isListening = false;
let isVoiceEnabled = false; // State to track if AI voice is on or off

// =========================================================
// Utility Functions
// =========================================================

function appendMessage(text, sender, elementId = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', `${sender}-message`);

    if (elementId !== null) {
        messageDiv.id = elementId;
    }

    let processedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let lastIndex = 0;
    let contentHtml = '';

    while ((match = codeBlockRegex.exec(processedText)) !== null) {
        contentHtml += processedText.substring(lastIndex, match.index);
        const language = match[1] || 'plaintext';
        const code = match[2].trim();
        contentHtml += `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
        lastIndex = codeBlockRegex.lastIndex;
    }
    contentHtml += processedText.substring(lastIndex);

    messageDiv.innerHTML = contentHtml;

    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;

    messageDiv.querySelectorAll('pre code').forEach((block) => {
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(block);
        }
    });
}

function removeMessage(elementId) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.remove();
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

function saveChatToLocalStorage(chatId) {
    if (!chatId) return;
    localStorage.setItem(chatId, chatArea.innerHTML);
}

// =========================================================
// Audio Playback Control Functions
// =========================================================

function stopAllAudios() {
    Object.values(audios).forEach(audio => {
        if (audio) { audio.pause(); audio.currentTime = 0; }
    });
}

function playAudioByKey(key) {
    if (audios[key]) {
        stopAllAudios();
        audios[key].play().catch(e => {
            console.error(`Audio play for key "${key}" failed:`, e);
            appendMessage('Üzgünüm, müziği çalarken bir sorun oluştu.', 'bot-message');
        });
    } else {
        console.warn('No audio element found for key:', key);
    }
}

/**
 * UPDATED: Uses the browser's Web Speech API to read the bot's response aloud,
 * ONLY if the user has enabled it via the toggle button.
 * @param {string} textToSpeak - The text for the bot to say.
 */
function cleanForTTS(text) {
    return text
        .replace(/[*_`#~>]/g, '')
        .replace(/\p{Emoji}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}

async function playBotResponseAudio(textToSpeak) {
    if (!isVoiceEnabled) return;
    if (!textToSpeak || !textToSpeak.trim()) return;

    stopAllAudios();

    try {
        const params = new URLSearchParams({
            text: cleanForTTS(textToSpeak),
            language: 'tr',
            gender: 'male'
        });
        const audio = new Audio(`/speak?${params}`);
        await audio.play();
    } catch (e) {
        console.error('TTS failed:', e);
    }
}
// =========================================================
// Chatbot Logic (Gemini AI & Voice Synthesis)
// =========================================================

async function getGeminiResponse(prompt) {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Backend error ${response.status}`);
    }

    const data = await response.json();

    if (
        Array.isArray(data.candidates) &&
        data.candidates.length > 0 &&
        data.candidates[0]?.content?.parts?.length > 0
    ) {
        return data.candidates[0].content.parts[0].text;
    }
    console.warn('Unexpected API response structure:', data);
    return 'Received an empty or unexpected response from IboChat.';
}

async function getChatbotTextResponse(userInputText) {
    let promptForGemini = 'Imagine you are Ibrahim Tatlises speak like him but in turkish and also Imagine you are in old Ibo show and make Ibrahim Tatlises speak like Ibrahim Tatlises is in old Ibo show but speak in Turkish no english\r\n';
    promptForGemini += userInputText;

    return await getGeminiResponse(promptForGemini);
}

// =========================================================
// Centralized Chatbot Response Handler
// =========================================================
async function handleUserMessage(userMessageText) {
    if (userMessageText === '') return;

    appendMessage(userMessageText, 'user-message');
    userInput.value = '';
    userInput.style.height = 'auto';

    const typingIndicatorId = 'typing-indicator-' + Date.now();
    appendMessage('Ibrahim Tatlises is thinking...', 'bot-message', typingIndicatorId);

    try {
        let botResponseText = '';
        const msgLower = userMessageText.toLowerCase();

        if (msgLower.includes('gelmesin')) {
            botResponseText = 'Gelmesin şarkısı başlatıldı 🎵';
            playAudioByKey('gelsin');
        } else if (msgLower.includes('mavisim')) {
            botResponseText = 'Mavisim şarkısı başlatıldı 🎵';
            playAudioByKey('mavisim');
        } else if (msgLower.includes('tosuno')) {
            botResponseText = 'Tosuno şarkısı başlatıldı 🎵';
            playAudioByKey('tosuno');
        } else if (msgLower.includes('kara üzüm')) {
            botResponseText = 'Kara Üzüm Habbesi başladı 🎵';
            playAudioByKey('karauzum');
        } else if (msgLower.includes('leylim')) {
            botResponseText = 'Leylim Ley başladı 🎵';
            playAudioByKey('leylim');
        } else if (msgLower.includes('urfaliyam')) {
            botResponseText = 'Urfaliyam Ezelden başladı 🎵';
            playAudioByKey('urfaliyam');
        } else if (msgLower.includes('cakmak')) {
            botResponseText = 'Çakmak Çakmağa Geldik başladı 🎵';
            playAudioByKey('cakmak');
        } else if (msgLower.includes('semmame')) {
            botResponseText = 'Şemmame başladı 🎵';
            playAudioByKey('semmame');
        } else if (msgLower.includes('esabini')) {
            botResponseText = 'Eşarbını Yan Bağlama başladı 🎵';
            playAudioByKey('esabini');
        } else if (msgLower.includes('maden')) {
            botResponseText = 'Maden Dağı başladı 🎵';
            playAudioByKey('maden');
        }
        else if (
            msgLower.includes('bana müzik çalar mısın') ||
            msgLower.includes('bana muzik cal') ||
            msgLower.includes('bana şarkı söyler misin') ||
            msgLower.includes('ibo show') ||
            msgLower.includes('müzik çal') ||
            msgLower.includes('şarkı söyle') ||
            msgLower.includes('çal müzik') ||
            msgLower.includes('play music')
        ) {
            botResponseText = 'Tabii ki! Bir şarkı seçip çalıyorum... 🎵';
            const songKeys = Object.keys(audios);
            const randomSong = songKeys[Math.floor(Math.random() * songKeys.length)];
            playAudioByKey(randomSong);
        }
        else if (
            msgLower.includes('müziği durdur') ||
            msgLower.includes('şarkıyı durdur') ||
            msgLower.includes('stop music') ||
            msgLower.includes('durdur müzik')
        ) {
            botResponseText = 'Müziği durduruyorum. 🎶';
            stopAllAudios();
        }
        else if (msgLower.includes('ibo show video') || msgLower.includes('hayatını anlat')) {
            botResponseText = 'İbrahim Tatlıses hayatını anlattığı videoyu oynatıyorum.';
            playBotResponseAudio(botResponseText);
        }
        else {
            const rawResponse = await getChatbotTextResponse(userMessageText);
            // **THIS IS THE ONLY CHANGE: It removes text inside parentheses**
            botResponseText = rawResponse.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
        }

        removeMessage(typingIndicatorId);
        appendMessage(botResponseText, 'bot-message');

        // This function will now only play audio if the toggle is on
        playBotResponseAudio(botResponseText);

        saveChatToLocalStorage(document.querySelector('.active-chat')?.dataset.chatId);
    } catch (error) {
        removeMessage(typingIndicatorId);
        console.error('Error in chatbot response:', error);
        appendMessage(`Üzgünüm, bir sorun oluştu: ${error.message || 'Lütfen tekrar deneyin.'}`, 'bot-message');
    }
}


// =========================================================
// Voice Command Processing
// =========================================================

async function processVoiceCommand(command) {
    userInput.value = command;
    chatForm.dispatchEvent(new Event('submit'));
}


// =========================================================
// Event Listeners and Initial Setup (DOMContentLoaded)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('loggedInUserIdentifier')) {
        window.location.href = 'login.html';
        return;
    }

    // Assign audio elements after DOM is loaded
    audios.gelsin = document.getElementById('backgroundMusicGelsin');
    audios.mavisim = document.getElementById('backgroundMusicMavisim');
    audios.tosuno = document.getElementById('backgroundMusicTosuno');
    audios.karauzum = document.getElementById('backgroundMusicKaraUzum');
    audios.leylim = document.getElementById('backgroundMusicLeylim');
    audios.urfaliyam = document.getElementById('backgroundMusicUrfaliyam');
    audios.cakmak = document.getElementById('backgroundMusicCakmak');
    audios.semmame = document.getElementById('backgroundMusicSemmane');
    audios.esabini = document.getElementById('backgroundMusicEsabini');
    audios.maden = document.getElementById('backgroundMusicMaden');

    // Assign chatListUl here as well
    chatListUl = document.getElementById('chat-list').querySelector('ul');

    // --- NEW: Event Listener for the Voice Toggle Button ---
    if (toggleVoiceBtn) {
        toggleVoiceBtn.addEventListener('click', () => {
            isVoiceEnabled = !isVoiceEnabled; // Toggle the state

            if (isVoiceEnabled) {
                toggleVoiceBtn.textContent = 'AI Sesi Açık 🔈';
                toggleVoiceBtn.classList.remove('btn-danger');
                toggleVoiceBtn.classList.add('btn-success');
                console.log('AI voice has been enabled.');
            } else {
                stopAllAudios(); // Immediately stop any speaking when muted
                toggleVoiceBtn.textContent = 'AI Sesi Kapalı 🔇';
                toggleVoiceBtn.classList.remove('btn-success');
                toggleVoiceBtn.classList.add('btn-danger');
                console.log('AI voice has been disabled.');
            }
        });
    }

    // --- Initialize Speech Recognition ---
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'tr-TR';

        recognition.onstart = () => {
            isListening = true;
            microphoneBtn.classList.add('btn-success');
            microphoneBtn.classList.remove('btn-primary');
            speechRecognitionStatus.textContent = 'Dinliyorum...';
            console.log('Speech recognition started.');
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            speechRecognitionStatus.textContent = interimTranscript;

            if (finalTranscript) {
                speechRecognitionStatus.textContent = '';
                processVoiceCommand(finalTranscript);
                recognition.stop();
            }
        };

        recognition.onend = () => {
            isListening = false;
            microphoneBtn.classList.remove('btn-success');
            microphoneBtn.classList.add('btn-primary');
            speechRecognitionStatus.textContent = '';
            console.log('Speech recognition ended.');
        };

        recognition.onerror = (event) => {
            isListening = false;
            microphoneBtn.classList.remove('btn-success');
            microphoneBtn.classList.add('btn-primary');
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                speechRecognitionStatus.textContent = 'Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.';
            } else if (event.error === 'no-speech') {
                speechRecognitionStatus.textContent = 'Konuşma algılanmadı. Lütfen tekrar deneyin.';
            } else if (event.error === 'aborted') {
                speechRecognitionStatus.textContent = 'Dinleme durduruldu.';
            }
            else {
                speechRecognitionStatus.textContent = 'Ses tanıma hatası: ' + event.error;
            }
        };

        microphoneBtn.addEventListener('click', () => {
            if (isListening) {
                recognition.stop();
            } else {
                speechRecognitionStatus.textContent = 'Dinliyorum...';
                recognition.start();
            }
        });

    } else {
        if (microphoneBtn) {
            microphoneBtn.disabled = true;
            microphoneBtn.textContent = 'Sesli Giriş Desteklenmiyor';
            speechRecognitionStatus.textContent = 'Tarayıcınız ses tanımayı desteklemiyor. Lütfen Chrome, Edge veya güncel Safari kullanın.';
        }
        console.warn('Web Speech API not supported in this browser.');
    }

    // --- Existing Chat Form (Text Input) Handler ---
    if (chatForm) {
        chatForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const userMessageText = userInput.value.trim();
            await handleUserMessage(userMessageText);
        });
    }

    // --- Textarea Auto-Resize ---
    if (userInput) {
        userInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                chatForm.dispatchEvent(new Event('submit'));
            }
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    // --- Sidebar & Theme Logic ---
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            const currentActive = chatListUl.querySelector('.active-chat');
            if (currentActive) {
                currentActive.classList.remove('active-chat');
            }
            const newChatLink = addNewChatToSidebar();
            newChatLink.classList.add('active-chat');
            switchChat(newChatLink.dataset.chatId);
        });
    }

    if (chatListUl) {
        chatListUl.addEventListener('click', (event) => {
            const chatLink = event.target.closest('a[data-chat-id]');
            if (chatLink) {
                event.preventDefault();
                const currentActive = chatListUl.querySelector('.active-chat');
                if (currentActive) currentActive.classList.remove('active-chat');
                chatLink.classList.add('active-chat');
                switchChat(chatLink.dataset.chatId);
            }
        });
    }

    function addNewChatToSidebar(chatTitle = 'Yeni Sohbet', chatId = `chat-${Date.now()}`) {
        const listItem = document.createElement('li');
        listItem.classList.add('my-1', 'sidebar-item');
        listItem.innerHTML = `
            <a href="#" data-chat-id="${chatId}" class="d-flex align-items-center text-light text-decoration-none p-2 rounded hover-bg-secondary">
                <i class="fa-regular fa-comment me-2"></i>
                <span class="flex-grow-1 text-truncate">${chatTitle}</span>
            </a>`;
        chatListUl.prepend(listItem);
        return listItem.querySelector('a');
    }

    function switchChat(chatId) {
        console.log(`Switching to chat: ${chatId}`);
        const savedChat = localStorage.getItem(chatId);
        if (savedChat) {
            chatArea.innerHTML = savedChat;
        } else {
            chatArea.innerHTML = '<div class="chat-message bot-message"> 👋 Sen nasılsın iyisin? </div>';
        }
        stopAllAudios();
    }

    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
});