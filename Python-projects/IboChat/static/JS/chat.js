/*
 * Created by: Emre
 * Created on: June 2025
 * This file contains the JS for index.html
 */

/* global hljs */ // Declare hljs as a global to prevent linting errors if it's external

'use strict';

// =========================================================
// UI Chrome Translations (nav bar / settings menu)
// =========================================================
// chat.html never had a translation system at all — unlike index.html
// (script.js's allTranslations) and create-character.html (its own
// CS_TRANSLATIONS), "New Chat", "Settings", etc. here were always hardcoded
// English. Follows the exact same pattern as create-character.js's
// CS_TRANSLATIONS/applyCharacterStudioTranslations, reading the same
// localStorage key so a language chosen on the homepage carries over here.
const CHAT_TRANSLATIONS = {
    en: { chat_new_chat: 'New Chat', chat_settings: 'Settings', chat_change_theme: 'Change Theme', chat_return_to_search: 'Return to Search' },
    tr: { chat_new_chat: 'Yeni Sohbet', chat_settings: 'Ayarlar', chat_change_theme: 'Temayı Değiştir', chat_return_to_search: 'Aramaya Dön' },
    es: { chat_new_chat: 'Nuevo Chat', chat_settings: 'Ajustes', chat_change_theme: 'Cambiar Tema', chat_return_to_search: 'Volver a la Búsqueda' },
    fr: { chat_new_chat: 'Nouvelle Discussion', chat_settings: 'Paramètres', chat_change_theme: 'Changer de Thème', chat_return_to_search: 'Retour à la Recherche' },
    de: { chat_new_chat: 'Neuer Chat', chat_settings: 'Einstellungen', chat_change_theme: 'Theme Ändern', chat_return_to_search: 'Zurück zur Suche' },
    it: { chat_new_chat: 'Nuova Chat', chat_settings: 'Impostazioni', chat_change_theme: 'Cambia Tema', chat_return_to_search: 'Torna alla Ricerca' },
    pt: { chat_new_chat: 'Novo Chat', chat_settings: 'Configurações', chat_change_theme: 'Mudar Tema', chat_return_to_search: 'Voltar à Pesquisa' },
    ru: { chat_new_chat: 'Новый чат', chat_settings: 'Настройки', chat_change_theme: 'Сменить тему', chat_return_to_search: 'Вернуться к поиску' },
    zh: { chat_new_chat: '新对话', chat_settings: '设置', chat_change_theme: '更换主题', chat_return_to_search: '返回搜索' },
    ja: { chat_new_chat: '新しいチャット', chat_settings: '設定', chat_change_theme: 'テーマを変更', chat_return_to_search: '検索に戻る' },
    ko: { chat_new_chat: '새 채팅', chat_settings: '설정', chat_change_theme: '테마 변경', chat_return_to_search: '검색으로 돌아가기' },
    ar: { chat_new_chat: 'دردشة جديدة', chat_settings: 'الإعدادات', chat_change_theme: 'تغيير السمة', chat_return_to_search: 'العودة إلى البحث' },
    hi: { chat_new_chat: 'नई चैट', chat_settings: 'सेटिंग्स', chat_change_theme: 'थीम बदलें', chat_return_to_search: 'खोज पर वापस जाएं' },
    nl: { chat_new_chat: 'Nieuwe Chat', chat_settings: 'Instellingen', chat_change_theme: 'Thema Wijzigen', chat_return_to_search: 'Terug naar Zoeken' },
    pl: { chat_new_chat: 'Nowy Czat', chat_settings: 'Ustawienia', chat_change_theme: 'Zmień Motyw', chat_return_to_search: 'Powrót do Wyszukiwania' },
    sv: { chat_new_chat: 'Ny Chatt', chat_settings: 'Inställningar', chat_change_theme: 'Ändra Tema', chat_return_to_search: 'Tillbaka till Sökning' },
    da: { chat_new_chat: 'Ny Chat', chat_settings: 'Indstillinger', chat_change_theme: 'Skift Tema', chat_return_to_search: 'Tilbage til Søgning' },
    no: { chat_new_chat: 'Ny Samtale', chat_settings: 'Innstillinger', chat_change_theme: 'Bytt Tema', chat_return_to_search: 'Tilbake til Søk' },
    fi: { chat_new_chat: 'Uusi Keskustelu', chat_settings: 'Asetukset', chat_change_theme: 'Vaihda Teema', chat_return_to_search: 'Takaisin Hakuun' },
    el: { chat_new_chat: 'Νέα Συνομιλία', chat_settings: 'Ρυθμίσεις', chat_change_theme: 'Αλλαγή Θέματος', chat_return_to_search: 'Επιστροφή στην Αναζήτηση' },
    hu: { chat_new_chat: 'Új Beszélgetés', chat_settings: 'Beállítások', chat_change_theme: 'Téma Váltása', chat_return_to_search: 'Vissza a Kereséshez' },
    cs: { chat_new_chat: 'Nový Chat', chat_settings: 'Nastavení', chat_change_theme: 'Změnit Téma', chat_return_to_search: 'Zpět na Vyhledávání' },
    ro: { chat_new_chat: 'Chat Nou', chat_settings: 'Setări', chat_change_theme: 'Schimbă Tema', chat_return_to_search: 'Înapoi la Căutare' },
    uk: { chat_new_chat: 'Новий Чат', chat_settings: 'Налаштування', chat_change_theme: 'Змінити Тему', chat_return_to_search: 'Повернутися до Пошуку' },
};

function applyChatTranslations() {
    const langCode = (localStorage.getItem('ibochat_ui_lang') || 'en').toLowerCase();
    const dict = CHAT_TRANSLATIONS[langCode] || CHAT_TRANSLATIONS.en;
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        const text = dict[key];
        if (!text) return;
        const icon = el.querySelector('i');
        el.textContent = ` ${text}`;
        if (icon) el.prepend(icon);
    });
}

// =========================================================
// Global DOM Element Selections
// =========================================================
const chatArea = document.getElementById('chat-area');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const microphoneBtn = document.getElementById('microphoneBtn');
const toggleVoiceBtn = document.getElementById('toggle-voice-btn'); // New button for voice
const speechRecognitionStatus = document.getElementById('speechRecognitionStatus');
let person = ""; // Placeholder for person variable, can be used later
// **UPDATED: Elements are now selected from their new locations in the navbar**
const btnToggle = document.getElementById('btn-toggle'); // Theme toggle button (now in dropdown)
const newChatBtn = document.getElementById('new-chat-btn'); // New Chat button (now a nav link)

// Sidebar elements
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
let isVoiceEnabled = false;
let activeLang = 'en-US';
let activeGender = 'male';
let activeCelebrityVoiceId = null;
// Short (1-2 sentence), factual, current-as-of-now grounding pulled from
// Wikipedia's own summary — see loadPersonCurrentFacts() and
// /api/celebrity-context in app.py. Fixes the AI confidently denying a real
// person's CURRENT role because its own training data predates it (e.g.
// denying being Prime Minister after actually taking office). Null for
// custom characters and until the lookup resolves.
let personCurrentFacts = null;
// Recent turns fed back into the prompt so the model has actual continuity
// instead of answering each message cold — that's what was producing the
// repeated stock phrases ("Thank you for your kind words", "As Prime
// Minister, I'm working on...") every reply, since with no memory of what
// it just said, generic phrasing is the safest default for the model to
// fall back on. Capped short since it's re-sent on every single request.
let conversationHistory = [];
const MAX_HISTORY_TURNS = 5;


const thinkingPhraseMap = {
    'en': 'is thinking...',
    'tr': 'düşünüyor...',
    'es': 'está pensando...',
    'fr': 'réfléchit...',
    'de': 'denkt nach...',
    'it': 'sta pensando...',
    'pt': 'está pensando...',
    'ru': 'думает...',
    'zh': '正在思考...',
    'ja': '考えています...',
    'ko': '생각 중...',
    'ar': 'يفكر...',
    'hi': 'सोच रहे हैं...',
    'nl': 'denkt na...',
    'pl': 'myśli...',
    'sv': 'tänker...',
    'da': 'tænker...',
    'no': 'tenker...',
    'fi': 'ajattelee...',
    'el': 'σκέφτεται...',
    'hu': 'gondolkodik...',
    'cs': 'přemýšlí...',
    'ro': 'se gândește...',
    'uk': 'думає...',
    'id': 'sedang berpikir...',
    'vi': 'đang suy nghĩ...',
    'th': 'กำลังคิด...',
};

function getThinkingPhrase(langLocale) {
    const code = langLocale.split('-')[0].toLowerCase();
    return thinkingPhraseMap[code] || 'is thinking...';
}

// Reverse of app.py's LANG_TO_OMNIVOICE — OmniVoice profiles report their
// language as a name ("Turkish"), not a code, so this maps back to a locale
// activeLang can use.
const OMNIVOICE_LANGUAGE_TO_LOCALE = {
    'Turkish': 'tr-TR', 'English': 'en-US', 'Spanish': 'es-ES', 'French': 'fr-FR',
    'German': 'de-DE', 'Italian': 'it-IT', 'Portuguese': 'pt-BR', 'Russian': 'ru-RU',
    'Chinese': 'zh-CN', 'Japanese': 'ja-JP', 'Korean': 'ko-KR', 'Arabic': 'ar-SA',
    'Hindi': 'hi-IN', 'Dutch': 'nl-NL', 'Polish': 'pl-PL', 'Swedish': 'sv-SE',
    'Danish': 'da-DK', 'Norwegian': 'nb-NO', 'Finnish': 'fi-FI', 'Greek': 'el-GR',
    'Hungarian': 'hu-HU', 'Czech': 'cs-CZ', 'Romanian': 'ro-RO', 'Ukrainian': 'uk-UA',
};

const langToLocaleMap = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'pt': 'pt-BR',
    'ru': 'ru-RU',
    'zh': 'zh-CN',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'ar': 'ar-SA',
    'hi': 'hi-IN',
    'tr': 'tr-TR',
    'nl': 'nl-NL',
    'pl': 'pl-PL',
    'sv': 'sv-SE',
    'el': 'el-GR',
    'hu': 'hu-HU',
    'cs': 'cs-CZ',
    'da': 'da-DK',
    'fi': 'fi-FI',
    'ro': 'ro-RO',
    'id': 'id-ID',
    'vi': 'vi-VN',
    'th': 'th-TH'
};

// =========================================================
// Utility Functions
// =========================================================

// This function is now correctly defined on its own.
function readFromQuerystring() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    person = params.get("person");
    characterId = params.get("character_id");
    // Falls back to the site-wide language preference (set on index.html,
    // read by create-character.html too) when the URL itself has no
    // ?lang= param — custom characters redirect here as plain
    // "chat.html?character_id=..." with no language info at all, which
    // was silently defaulting everyone to English regardless of what
    // they'd actually chosen on the homepage.
    const langCode = params.get("lang") || localStorage.getItem('ibochat_ui_lang');
    const genderParam = params.get("gender");

    if (langCode && langToLocaleMap[langCode]) {
        activeLang = langToLocaleMap[langCode];
    } else if (langCode) {
        activeLang = langCode;
    }

    if (genderParam === 'female' || genderParam === 'male') {
        activeGender = genderParam;
    }
}

// Custom (user-created) character mode — a completely separate path from the
// real-celebrity flow above. No Wikipedia lookup, no fuzzy name-matching
// against OmniVoice profiles: we already know the exact voice_id (if any)
// and the personality text straight from the character record.
let characterId = null;
let characterPersonality = null;

async function loadCustomCharacter() {
    if (!characterId) return;
    try {
        const resp = await fetch(`/api/characters/${characterId}`);
        if (!resp.ok) {
            console.error(`[custom-character] GET /api/characters/${characterId} failed: ${resp.status}`);
            return;
        }
        const data = await resp.json();
        person = data.name;
        characterPersonality = data.personality;

        // For a real celebrity, `person` comes straight from the URL, so the
        // title/heading/placeholder/navbar-brand updates in DOMContentLoaded
        // run synchronously and already have the right name. Here `person`
        // only becomes known after this fetch resolves — by which point that
        // synchronous code has already run and seen `person` as null, so the
        // page was left showing chat.html's static placeholder text (the
        // literal word "Tarkan" baked into the HTML) instead of this
        // character's actual name. Set it here instead, now that we know it.
        document.title = `Chat with ${person}`;
        const welcomeHeading = document.getElementById('famouse-show');
        if (welcomeHeading) welcomeHeading.innerHTML = `${person} 🎤`;
        const userInputElement = document.getElementById('user-input');
        if (userInputElement) userInputElement.placeholder = person;
        const navbarBrand = document.querySelector('.navbar-brand');
        if (navbarBrand) navbarBrand.innerHTML = person;

        if (data.voice_id) {
            activeCelebrityVoiceId = data.voice_id;
            const btn = document.getElementById('celebrity-voice-btn');
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-star" style="color:#ffc107"></i>';
                btn.title = `Using ${data.name}'s cloned voice`;
            }
            if (!isVoiceEnabled && toggleVoiceBtn) {
                isVoiceEnabled = true;
                toggleVoiceBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                toggleVoiceBtn.classList.remove('btn-secondary');
                toggleVoiceBtn.classList.add('btn-success');
            }
        } else {
            showVoiceMissingNotice(data.name);
        }
    } catch (e) {
        console.error('[custom-character] failed to load:', e);
    }
}

// Cloning can fail at creation time (OmniVoice Studio not running is the
// common one) and the character is then saved with voice_id = NULL — the
// chat works, but every reply uses the generic edge-tts voice instead of
// the user's cloned one. Surface that here instead of leaving it silent,
// and offer one-click recovery: the raw recording from create-character.js
// is still in IndexedDB (character_recording::<id>), so the /reclone
// endpoint can retry the OmniVoice clone and patch voice_id in place.
function showVoiceMissingNotice(characterName) {
    const chatArea = document.getElementById('chat-area');
    if (!chatArea) return;

    const banner = document.createElement('div');
    banner.className = 'alert alert-warning mx-3 mt-2 py-2';
    banner.innerHTML = `<strong>${characterName}</strong> has no cloned voice yet — replies will use a default voice. `;

    const recloneBtn = document.createElement('button');
    recloneBtn.className = 'btn btn-sm btn-warning ms-1';
    recloneBtn.textContent = 'Re-clone from saved recording';
    recloneBtn.addEventListener('click', async () => {
        recloneBtn.disabled = true;
        recloneBtn.textContent = 'Cloning...';
        try {
            const blob = (typeof IboAudioStore !== 'undefined')
                ? await IboAudioStore.get(`character_recording::${characterId}`)
                : null;
            if (!blob) {
                recloneBtn.textContent = 'No saved recording in this browser';
                return;
            }
            const fd = new FormData();
            fd.append('voice_sample', blob, 'voice_sample.webm');
            const resp = await fetch(`/api/characters/${characterId}/reclone`, { method: 'POST', body: fd });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || !data.voice_id) throw new Error(data.error || `Re-clone failed (${resp.status})`);

            activeCelebrityVoiceId = data.voice_id;
            const btn = document.getElementById('celebrity-voice-btn');
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-star" style="color:#ffc107"></i>';
                btn.title = `Using ${person}'s cloned voice`;
            }
            banner.remove();
        } catch (err) {
            console.error('[custom-character] re-clone failed:', err);
            recloneBtn.disabled = false;
            recloneBtn.textContent = 'Re-clone failed — is OmniVoice running? Retry';
        }
    });

    banner.appendChild(recloneBtn);
    chatArea.insertAdjacentElement('beforebegin', banner);
}

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
    speechQueue.stop();
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

function cleanForTTS(text) {
    return text
        .replace(/[*_`#~>]/g, '')
        .replace(/\p{Emoji}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Sentence-streaming speech queue — queues each sentence as its text arrives,
// but only fetches ONE at a time. A celebrity voice_id routes through OmniVoice,
// which on this hardware has a single GPU worker slot: firing every sentence's
// request in parallel (the old "prefetch everything" behavior) just meant later
// sentences sat behind earlier ones in the server's own queue until they blew
// past any client timeout. Fetching lazily, one at a time, means each request
// only ever waits for its own generation time — slower between sentences, but
// it actually finishes instead of timing out and silently falling back.
class SpeechQueue {
    constructor() {
        this.queue = [];      // array of raw sentence strings — NOT yet fetched
        this.currentAudio = null;
        this.playing = false;
        // Fired whenever the queue drains back to empty — call mode uses
        // this as the signal that it's safe to start listening for the
        // user's next turn again (starting mic capture while the celebrity's
        // reply is still playing would just pick the TTS audio back up).
        this.onIdle = null;
        // The in-flight /speak request, if any — so stop() can actually
        // cancel it instead of just abandoning it. On this hardware's single
        // GPU worker, an abandoned-but-still-running generation (e.g. from
        // hanging up mid-reply, or a message sent right before a hangup)
        // keeps occupying the one GPU slot server-side, silently slowing
        // down whatever request comes after it — the fetch being "ignored"
        // client-side does nothing to stop the server from still working on it.
        this._abortController = null;
    }

    async _fetch(text) {
        // Check the on-device cache first — same text/voice/language combo
        // (e.g. a greeting that repeats, or re-visiting a chat) plays
        // instantly from local storage instead of waiting on generation
        // again, which on this hardware is a real 5-40s difference.
        const cacheKey = (typeof IboAudioStore !== 'undefined')
            ? IboAudioStore.speakKey(text, activeCelebrityVoiceId, activeLang)
            : null;
        if (cacheKey) {
            const cached = await IboAudioStore.get(cacheKey);
            if (cached) return URL.createObjectURL(cached);
        }

        const params = new URLSearchParams({ text, language: activeLang, gender: activeGender });
        if (activeCelebrityVoiceId) params.set('voice_id', activeCelebrityVoiceId);
        this._abortController = new AbortController();
        try {
            const r = await fetch(`/speak?${params}`, { signal: this._abortController.signal });
            if (!r.ok) throw new Error(`/speak returned ${r.status}`);
            const blob = await r.blob();
            if (cacheKey) IboAudioStore.set(cacheKey, blob); // fire-and-forget
            return URL.createObjectURL(blob);
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('[speak] request cancelled (call ended or new message replaced it)');
            } else {
                console.error('[speak] request failed:', err, `voice_id=${activeCelebrityVoiceId || '(none)'}`);
            }
            return null;
        } finally {
            this._abortController = null;
        }
    }

    add(text) {
        const cleaned = cleanForTTS(text);
        if (!cleaned) return;
        // Just queue the text — the fetch itself is kicked off lazily in _next(),
        // one at a time, so we never pile up parallel requests behind each other.
        this.queue.push(cleaned);
        if (!this.playing) this._next();
    }

    stop() {
        this.queue = [];
        this.playing = false;
        // Actually cancel a generation in progress — see the constructor
        // note on why an abandoned-but-still-running request is a real
        // problem here, not just wasted client-side work.
        if (this._abortController) {
            this._abortController.abort();
            this._abortController = null;
        }
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
    }

    async _next() {
        if (this.queue.length === 0) {
            this.playing = false;
            this._setStatus(null); // nothing left queued — clear the indicator
            if (this.onIdle) this.onIdle();
            return;
        }
        this.playing = true;
        const text = this.queue.shift();

        // A cloned voice takes ~5-40s to generate on this hardware, with
        // nothing else in the UI to show it's working — that silence reads
        // as "broken" rather than "generating," which is exactly what was
        // being reported. Make the wait visible.
        this._setStatus(activeCelebrityVoiceId ? '🎙️ Generating voice…' : '🔊 Loading voice…');
        const blobUrl = await this._fetch(text);
        if (!blobUrl || !this.playing) { this._setStatus(null); this._next(); return; }

        this._setStatus(null);
        const audio = new Audio(blobUrl);
        this.currentAudio = audio;
        const cleanup = () => { URL.revokeObjectURL(blobUrl); this._next(); };
        audio.onended = cleanup;
        // Previously silent on both paths — a decode failure (onerror) and a
        // blocked/rejected play() call looked identical to "nothing happened,
        // no voice at all," which is exactly what was reported. Browsers can
        // refuse programmatic audio.play() (autoplay policy) without ever
        // firing onerror, so that rejection was going nowhere.
        audio.onerror = () => {
            console.error('[speak] audio element error:', audio.error);
            this._setStatus('⚠️ Audio failed to load — see console');
            cleanup();
        };
        audio.play().catch((e) => {
            console.error('[speak] audio.play() was blocked/rejected:', e);
            this._setStatus('⚠️ Browser blocked audio playback — click anywhere on the page and try again');
            cleanup();
        });
    }

    _setStatus(text) {
        const el = document.getElementById('celebrity-voice-status');
        if (el) {
            if (text) {
                el.textContent = text;
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
        }
        // The call overlay sits on top of everything and hides the element
        // above entirely — a cloned voice can take 30-90s+ to generate on
        // this hardware (see the GPU-contention note in CLAUDE.md), and with
        // nothing shown during that wait "Connected" just sits there looking
        // stuck/broken, indistinguishable from having silently fallen back
        // to the default voice. Mirror the same status into the call UI.
        const callStatusEl = document.getElementById('call-status-line');
        if (callStatusEl && callModeActive) {
            callStatusEl.textContent = text || 'Connected';
        }
    }
}

const speechQueue = new SpeechQueue();

async function playBotResponseAudio(textToSpeak) {
    if (!isVoiceEnabled) return;
    if (!textToSpeak || !textToSpeak.trim()) return;
    speechQueue.add(textToSpeak);
}

// Normalize Turkish/accented characters for fuzzy name matching. toLowerCase()
// itself turns İ into "i" + a combining dot (U+0307) under JS's
// locale-independent casing — harmless here since both sides of any
// comparison go through the same function, but strip it explicitly so the
// normalized form is the plain ASCII string it looks like. Shared by
// loadCelebrityVoices (scopes the dropdown to the current person) and
// autoMatchCelebrityVoice (auto-selects that person's voice).
const normalize = s => (s || '').toLowerCase()
    .replace(/İ/g, 'i').replace(/ı/g, 'i').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o')
    .replace(/ç/g, 'c').replace(/â/g, 'a').replace(/é/g, 'e')
    .replace(/̇/g, '');

async function loadCelebrityVoices() {
    const menu = document.getElementById('celebrity-voice-menu');
    if (!menu) return;

    try {
        const resp = await fetch('/api/voices');
        const data = await resp.json();
        const allProfiles = Array.isArray(data) ? data : (data.profiles || []);

        // This chat page is already about one specific person — showing all
        // other celebrities as alternate "voices" here made no sense. Scope
        // the picker to just the current person (+ Default) whenever we know
        // who that is; only fall back to the full list (with a search box to
        // make scanning it bearable) if we don't.
        //
        // Custom characters are a special case: name-based fuzzy matching
        // breaks down the moment someone creates more than one character with
        // the same name (every test recording of "Mahmut" is its own OmniVoice
        // profile, all sharing that name) — the dropdown ends up listing
        // several identical-looking "Mahmut" entries with no way to tell which
        // is the actual good clone, and picking the wrong one silently plays
        // an old/bad recording instead. For a custom character we already know
        // the exact correct voice_id from the character record itself, so
        // match on that id directly instead of the name.
        const personNorm = normalize(person);
        const scoped = characterId && activeCelebrityVoiceId
            ? allProfiles.filter(p => p.id === activeCelebrityVoiceId)
            : person
                ? allProfiles.filter(p => {
                    const pNorm = normalize(p.name);
                    return pNorm.includes(personNorm) || personNorm.includes(pNorm);
                })
                : [];
        const profiles = scoped.length > 0 ? scoped : allProfiles;
        const showSearch = scoped.length === 0;

        menu.innerHTML = '';
        menu.style.maxHeight = '320px';
        menu.style.overflowY = 'auto';

        // Search box only when the list isn't already scoped down to ~1 name.
        if (showSearch) {
            const searchItem = document.createElement('li');
            searchItem.className = 'p-2';
            searchItem.innerHTML = `<input type="text" class="form-control form-control-sm" id="celebrityVoiceSearchInput" placeholder="Search names...">`;
            menu.appendChild(searchItem);
            const dividerTop = document.createElement('li');
            dividerTop.innerHTML = '<hr class="dropdown-divider">';
            menu.appendChild(dividerTop);
        }

        // Default / no celebrity voice option
        const defaultItem = document.createElement('li');
        defaultItem.innerHTML = `<a class="dropdown-item celebrity-voice-option ${activeCelebrityVoiceId === null ? 'active' : ''}" href="#" data-voice-id="">
            <i class="fa-solid fa-volume-high me-2"></i>Default Voice
        </a>`;
        menu.appendChild(defaultItem);

        if (profiles.length > 0) {
            const divider = document.createElement('li');
            divider.innerHTML = '<hr class="dropdown-divider">';
            menu.appendChild(divider);

            profiles.forEach(profile => {
                const item = document.createElement('li');
                item.innerHTML = `<a class="dropdown-item celebrity-voice-option ${activeCelebrityVoiceId === profile.id ? 'active' : ''}" href="#" data-voice-id="${profile.id}" data-voice-lang="${profile.language || ''}">
                    <i class="fa-solid fa-star me-2"></i>${profile.name}
                </a>`;
                menu.appendChild(item);
            });
        } else {
            const emptyItem = document.createElement('li');
            emptyItem.innerHTML = '<span class="dropdown-item-text text-muted small">No voices found.<br>Add voices in OmniVoice Studio.</span>';
            menu.appendChild(emptyItem);
        }

        const searchInput = document.getElementById('celebrityVoiceSearchInput');
        if (searchInput) {
            searchInput.addEventListener('click', (e) => e.stopPropagation()); // don't close the dropdown
            searchInput.addEventListener('keyup', () => {
                const filterText = searchInput.value.toLowerCase();
                menu.querySelectorAll('li').forEach(li => {
                    const option = li.querySelector('.celebrity-voice-option');
                    if (!option) return; // leave the search box / dividers alone
                    li.style.display = option.textContent.toLowerCase().includes(filterText) ? '' : 'none';
                });
            });
            searchInput.focus();
        }
    } catch (e) {
        menu.innerHTML = '<li><span class="dropdown-item-text text-muted small">OmniVoice Studio not running.</span></li>';
    }
}

// Kept as a hidden state-tracker (still visible in devtools/console via the
// warn/error console calls at each call site) — the on-page banner itself
// was removed since the pipeline's reliable now and it was just clutter.
function setCelebrityVoiceStatus(message, kind) {
    const el = document.getElementById('celebrity-voice-status');
    if (!el) return;
    el.textContent = message;
    el.className = `celebrity-voice-status celebrity-voice-status--${kind}`;
    el.style.display = 'none';
}

// Promise the rest of the app can await so no /speak request ever fires
// before we've resolved (matched, created, or given up on) a celebrity
// voice — closes the race that let early messages fall back to the
// generic voice even when the real clone was available.
let celebrityVoiceReadyPromise = Promise.resolve();

async function autoMatchCelebrityVoice() {
    if (!person) return;

    const btn = document.getElementById('celebrity-voice-btn');

    const applyVoice = (id, name, ovLanguage) => {
        activeCelebrityVoiceId = id;
        // Sync activeLang to the voice profile's own language whenever OmniVoice
        // tells us it (e.g. "Turkish"), instead of trusting whatever ?lang= was
        // (or wasn't) on the URL — that param can be missing/stale depending on
        // how the page was reached, which was sending Turkish text through with
        // language=en-US and getting English-voiced TTS as a result.
        const locale = OMNIVOICE_LANGUAGE_TO_LOCALE[ovLanguage];
        if (locale) activeLang = locale;
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-star" style="color:#ffc107"></i>';
            btn.title = `Celebrity voice: ${name}`;
        }
        // Auto-enable voice when a celebrity voice is matched
        if (!isVoiceEnabled && toggleVoiceBtn) {
            isVoiceEnabled = true;
            toggleVoiceBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            toggleVoiceBtn.classList.remove('btn-secondary');
            toggleVoiceBtn.classList.add('btn-success');
        }
        console.log(`[celebrity-voice] using cloned voice "${name}" (${id}) for "${person}"`);
        setCelebrityVoiceStatus(`🎤 Using ${name}'s real cloned voice`, 'ok');
    };

    setCelebrityVoiceStatus(`Looking up ${person}'s voice…`, 'pending');

    try {
        // 1. Check existing profiles first
        const resp = await fetch('/api/voices');
        if (!resp.ok) {
            console.error(`[celebrity-voice] GET /api/voices failed: ${resp.status}`);
            setCelebrityVoiceStatus(`⚠️ Couldn't reach OmniVoice — using default voice`, 'warn');
            return;
        }
        const data = await resp.json();
        const profiles = Array.isArray(data) ? data : (data.profiles || []);
        console.log(`[celebrity-voice] ${profiles.length} profile(s) available:`, profiles.map(p => p.name));
        const personNorm = normalize(person);
        const match = profiles.find(p => {
            const pNorm = normalize(p.name);
            return pNorm.includes(personNorm) || personNorm.includes(pNorm);
        });

        if (match) {
            applyVoice(match.id, match.name, match.language);
            return;
        }
        console.log(`[celebrity-voice] no existing profile matched "${person}" (normalized: "${personNorm}") — auto-creating`);

        // 2. No profile found — auto-create it (download + clone)
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="color:#ffc107"></i>';
            btn.title = `Creating ${person} voice...`;
        }
        setCelebrityVoiceStatus(`Creating ${person}'s voice for the first time (this can take a minute)…`, 'pending');

        const createResp = await fetch('/api/voices/auto-create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: person, language: activeLang.split('-')[0] })
        });

        if (!createResp.ok) {
            const detail = await createResp.json().catch(() => ({}));
            console.error(`[celebrity-voice] /api/voices/auto-create failed: ${createResp.status}`, detail);
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-star"></i>'; btn.title = 'Celebrity Voice'; }
            setCelebrityVoiceStatus(`⚠️ Couldn't clone ${person}'s voice — using default voice`, 'warn');
            return;
        }

        const profile = await createResp.json();
        applyVoice(profile.id, profile.name, profile.language);

    } catch (e) {
        // OmniVoice not running — fall back to edge-tts, but say so instead of
        // failing silently, so "why don't I hear the real voice" is answerable
        // from the page itself instead of needing devtools.
        console.error('[celebrity-voice] auto-match/create threw:', e);
        if (btn) { btn.innerHTML = '<i class="fa-solid fa-star"></i>'; btn.title = 'Celebrity Voice'; }
        setCelebrityVoiceStatus(`⚠️ OmniVoice unavailable — using default voice`, 'warn');
    }
}


function setupCelebrityVoicePicker() {
    const btn = document.getElementById('celebrity-voice-btn');
    const menu = document.getElementById('celebrity-voice-menu');
    if (!btn || !menu) return;

    // Load voices when dropdown opens
    btn.addEventListener('show.bs.dropdown', loadCelebrityVoices);

    // Handle voice selection
    menu.addEventListener('click', (e) => {
        const option = e.target.closest('.celebrity-voice-option');
        if (!option) return;
        e.preventDefault();

        const voiceId = option.dataset.voiceId;
        activeCelebrityVoiceId = voiceId || null;
        const locale = OMNIVOICE_LANGUAGE_TO_LOCALE[option.dataset.voiceLang];
        if (activeCelebrityVoiceId && locale) activeLang = locale;

        // Update active state
        menu.querySelectorAll('.celebrity-voice-option').forEach(el => el.classList.remove('active'));
        option.classList.add('active');

        // Update button icon to show a voice is selected
        if (activeCelebrityVoiceId) {
            btn.innerHTML = '<i class="fa-solid fa-star" style="color:#ffc107"></i>';
            btn.title = `Celebrity voice: ${option.textContent.trim()}`;
        } else {
            btn.innerHTML = '<i class="fa-solid fa-star"></i>';
            btn.title = 'Celebrity Voice';
        }
    });
}
// =========================================================
// Chatbot Logic (Gemini AI & Voice Synthesis)
// =========================================================

/**
 * Gets a response from the Gemini API via our secure serverless function.
 * @param {string} prompt - The complete prompt to send to the AI.
 * @returns {Promise<string>} The text response from the AI.
 */
async function getGeminiResponse(prompt, onChunk, language) {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `API error ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        if (onChunk) onChunk(fullText);
    }

    return fullText;
}

const LANG_CODE_TO_NAME = {
    'tr': 'Turkish', 'en': 'English', 'es': 'Spanish', 'fr': 'French',
    'de': 'German',  'it': 'Italian', 'pt': 'Portuguese','ru': 'Russian',
    'zh': 'Chinese', 'ja': 'Japanese','ko': 'Korean',   'ar': 'Arabic',
    'hi': 'Hindi',   'nl': 'Dutch',   'pl': 'Polish',   'sv': 'Swedish',
    'da': 'Danish',  'no': 'Norwegian','fi': 'Finnish',  'el': 'Greek',
    'hu': 'Hungarian','cs': 'Czech',  'ro': 'Romanian', 'uk': 'Ukrainian',
};

async function getChatbotTextResponse(userInputText, onChunk) {
    const langCode = activeLang.split('-')[0].toLowerCase();
    const replyLang = LANG_CODE_TO_NAME[langCode] || 'English';
    // Custom characters get a personality-driven prompt instead of "you are
    // this real public figure" — there's no real person to imitate, just
    // whatever description the creator wrote.
    // Kept short on purpose, not just for style: every reply gets spoken
    // aloud through a cloned voice on a single 4GB GPU (see CLAUDE.md's
    // "known ceiling" note), and generation time scales with text length —
    // a multi-paragraph reply can take long enough to blow past even a
    // generous server-side timeout. Capping length here fixes that at the
    // source instead of chasing it with ever-longer timeouts, and a real
    // phone call wouldn't get a Wikipedia-length answer either.
    const lengthLimit = 'Keep your response SHORT — 1 to 3 sentences, like a real spoken reply, never a long explanation.';
    // Grounds the roleplay in Wikipedia's current summary for real people —
    // without it, the AI's own training-data cutoff can make it confidently
    // deny a role/title someone has since actually taken (see
    // loadPersonCurrentFacts / /api/celebrity-context).
    // The Wikipedia summary below is pulled from the article's canonical
    // title, which is sometimes a formal/legal name rather than the
    // commonly-known name the user actually searched for (e.g. searching
    // "Cübbeli Ahmet Hoca" resolves to the Wikipedia article "Ahmet Mahmut
    // Ünlü") — without this note, the AI can get confused mid-reply and
    // start calling itself by that other name instead of staying consistent
    // with ${person}, which is what it's actually being addressed as here.
    const currentFactsNote = personCurrentFacts
        ? ` Here is a short, current, factual summary of who you are right now — stay consistent with it, even if it differs from what you might otherwise assume: "${personCurrentFacts}". Note: you may be referred to here by a different name/title (e.g. a nickname or common name) than the one in that summary — they are the same person; always respond in-character as ${person}, the name you're being addressed as, not whatever name appears in the summary.`
        : '';
    // Without this, every reply defaults to the same safe stock phrasing —
    // explicitly telling the model not to reuse its own recent wording (and
    // showing it that wording via the history below) is what actually stops it.
    const noRepeatNote = ' Vary your wording every time — do not reuse the same sentence openings, phrases, or structure you used in your recent replies below. Respond specifically to what the user just said, not with a generic deflection.';
    const historyBlock = conversationHistory.length
        ? '\n\nRecent conversation so far:\n' + conversationHistory
            .map(turn => `User: ${turn.user}\n${person}: ${turn.bot}`)
            .join('\n') + '\n'
        : '';
    const promptForGemini = characterPersonality
        ? `You are ${person}, a character described as: ${characterPersonality}. Speak in first person, staying fully in character. ${lengthLimit}${noRepeatNote}${historyBlock}\nUser: ${userInputText}\n${person}:`
        : `You are role-playing as ${person}. Match their personality and speaking style. Speak in first person as ${person}.${currentFactsNote} ${lengthLimit}${noRepeatNote}${historyBlock}\nUser: ${userInputText}\n${person}:`;
    return await getGeminiResponse(promptForGemini, onChunk, replyLang);
}

/**
 * ===================================================================================
 * SECTION 5: CENTRALIZED CHATBOT RESPONSE HANDLER
 * ===================================================================================
 */
let messageInFlight = false; // true from the moment a message starts processing until its reply (text+audio) is fully handled — blocks a second overlapping call from producing a duplicate reply to the same turn

async function handleUserMessage(userMessageText) {
    if (userMessageText === '') return;
    // During a call, overlapping/leftover speech-recognition sessions (the
    // same instability behind the "aborted" console spam) can each
    // independently produce their own final transcript for what was
    // effectively one utterance, each separately calling this function —
    // producing two AI replies stacked up for what was really one turn.
    // This guard makes that a hard impossibility regardless of how many
    // overlapping recognition sessions are actually misbehaving upstream:
    // only one message is ever "in flight" at a time.
    if (messageInFlight) {
        console.warn('[chat] dropped overlapping message while one was already in flight:', userMessageText);
        return;
    }
    messageInFlight = true;

    try {
    // Never let a message's TTS go out while the celebrity-voice lookup is
    // still in flight — otherwise the first message (or a fast one right
    // after page load) can fire /speak before activeCelebrityVoiceId is set
    // and silently fall back to the generic voice.
    await celebrityVoiceReadyPromise;

    appendMessage(userMessageText, 'user-message');
    updateCallCaption('you', userMessageText);
    userInput.value = '';
    userInput.style.height = 'auto';

    const msgLower = userMessageText.toLowerCase();

    if (msgLower.includes('ibo show video') || msgLower.includes('hayatını anlat')) {
        const msg = 'İbrahim Tatlıses hayatını anlattığı videoyu oynatıyorum.';
        appendMessage(msg, 'bot-message');
        playBotResponseAudio(msg);
        return;
    }

    // Show thinking indicator immediately, then replace with streamed text
    const bubbleId = 'bot-bubble-' + Date.now();
    const thinkingPhrase = getThinkingPhrase(activeLang);
    appendMessage(`${person} ${thinkingPhrase}`, 'bot-message', bubbleId);
    const bubble = document.getElementById(bubbleId);
    let firstChunk = true;

    try {
        const finalText = await getChatbotTextResponse(userMessageText, (partial) => {
            if (bubble) {
                if (firstChunk) { bubble.textContent = ''; firstChunk = false; }
                bubble.textContent = partial;
            }
            chatArea.scrollTop = chatArea.scrollHeight;
            // Text still streams in live for the visible bubble, but TTS no longer
            // fires per-sentence as it arrives — see playBotResponseAudio below for why.
        });

        const cleaned = finalText.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
        if (bubble) bubble.textContent = cleaned;
        chatArea.scrollTop = chatArea.scrollHeight;
        updateCallCaption('them', cleaned);

        conversationHistory.push({ user: userMessageText, bot: cleaned });
        if (conversationHistory.length > MAX_HISTORY_TURNS) conversationHistory.shift();

        // Speak the whole reply as ONE request instead of splitting it into
        // per-sentence chunks. On this hardware each generation has a real
        // ~30-40s floor regardless of how short the text is, so 5 short
        // sentences meant 5 separate waits with dead silence between each —
        // it read as constant pausing. One request for the full text costs
        // one wait up front, then plays straight through with only the
        // natural pauses the model itself puts at periods/commas.
        playBotResponseAudio(cleaned);

        saveChatToLocalStorage(document.querySelector('.active-chat')?.dataset.chatId);
    } catch (error) {
        if (bubble) bubble.textContent = `Üzgünüm, bir sorun oluştu: ${error.message || 'Lütfen tekrar deneyin.'}`;
        console.error('Error in chatbot response:', error);
    }
    } finally {
        messageInFlight = false;
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
// "Phone Call" Mode
// =========================================================
// A full-screen call UI wrapped around the exact same chat/TTS pipeline
// (handleUserMessage → getChatbotTextResponse → playBotResponseAudio) —
// nothing new on the AI/voice side, just: continuous mic listening instead
// of one-shot press-to-talk, live captions instead of chat bubbles, and
// ringing/connected/timer chrome to sell the "calling" feel. Requires the
// same Web Speech API the mic button already uses, so it inherits the same
// Chrome/Edge-only, internet-required limitation.
let callModeActive = false;
let callMuted = false;
let callTimerInterval = null;
let callMicBlocked = false; // set on a fatal recognition error (see recognition.onerror below); stops auto-retry from re-prompting forever
let recognitionStarting = false; // true between calling recognition.start() and it actually settling (onstart/onend/onerror) — closes the double-start race described in startCallListening()
let recognitionWatchdogTimer = null; // pending "never settled" timer — cleared the instant a genuine transcript proves the session is actually alive
// Rate-based circuit breaker, replacing an earlier streak counter that had a
// real bug: it was reset to 0 by onerror even for 'aborted'/'no-speech' —
// meaning a fast fail-loop (start → instant error → onend → 300ms retry →
// instant error → ...) never tripped the breaker at all, because every
// single error "proved it wasn't stuck" even though it very much was,
// racking up 100+ errors in seconds with no way to stop. Only a genuine
// transcript (onresult) now counts as proof of health; every failure — the
// watchdog timing out, or any onerror at all — counts against the breaker,
// regardless of which specific error it was.
let recognitionErrorTimestamps = [];
const RECOGNITION_ERROR_WINDOW_MS = 10000;
const RECOGNITION_ERROR_THRESHOLD = 5;
let recognitionAutoRetryDisabled = false;
// Tripping the breaker used to mean "silent for the rest of the call, hang
// up to try again" — it correctly stopped the spam, but never tried to come
// back, which is a real gap: a transient service hiccup (the underlying
// browser speech backend blipping for a few seconds) shouldn't cost you the
// rest of the call. Now it backs off and retries on its own: 15s, then 30s,
// then 60s (capped) if it keeps failing, resetting to 15s the moment a
// retry actually succeeds.
let recognitionBackoffAttempt = 0;
let recognitionCooldownTimer = null;
const RECOGNITION_BACKOFF_BASE_MS = 15000;
const RECOGNITION_BACKOFF_MAX_MS = 60000;

function recognitionRecordFailure() {
    const now = Date.now();
    recognitionErrorTimestamps.push(now);
    recognitionErrorTimestamps = recognitionErrorTimestamps.filter(t => now - t < RECOGNITION_ERROR_WINDOW_MS);
    if (recognitionErrorTimestamps.length >= RECOGNITION_ERROR_THRESHOLD) {
        recognitionAutoRetryDisabled = true;
        const delay = Math.min(RECOGNITION_BACKOFF_BASE_MS * Math.pow(2, recognitionBackoffAttempt), RECOGNITION_BACKOFF_MAX_MS);
        recognitionBackoffAttempt++;
        console.warn(`[call] ${recognitionErrorTimestamps.length} recognition failures within ${RECOGNITION_ERROR_WINDOW_MS / 1000}s — backing off ${delay / 1000}s before retrying (attempt ${recognitionBackoffAttempt}).`);
        const callStatusEl = document.getElementById('call-status-line');
        if (callModeActive && callStatusEl) {
            callStatusEl.textContent = `🎤 Voice input is struggling — retrying automatically in ${delay / 1000}s (you can still type).`;
        }
        clearTimeout(recognitionCooldownTimer);
        recognitionCooldownTimer = setTimeout(() => {
            if (!callModeActive) return; // call ended during the cooldown — nothing to resume
            console.warn('[call] backoff elapsed — giving recognition another try');
            recognitionErrorTimestamps = []; // fresh window for the retry — don't let it inherit the count that just tripped it
            recognitionAutoRetryDisabled = false;
            const callStatusEl2 = document.getElementById('call-status-line');
            if (callStatusEl2) callStatusEl2.textContent = 'Connected';
            startCallListening();
        }, delay);
    }
    return recognitionAutoRetryDisabled;
}

function recognitionRecordSuccess() {
    recognitionErrorTimestamps = [];
    recognitionAutoRetryDisabled = false;
    recognitionBackoffAttempt = 0; // a real transcript came through — whatever was wrong resolved, so drop back to the shortest backoff for next time
    clearTimeout(recognitionCooldownTimer);
}
let greetingInFlight = false; // true while playCallGreeting() is generating/queuing — prevents two overlapping calls from producing the greeting twice

function updateCallCaption(who, text) {
    if (!callModeActive) return;
    const captions = document.getElementById('call-captions');
    if (!captions) return;
    const line = document.createElement('p');
    line.className = `call-caption-line ${who}`;
    if (who === 'them') line.dataset.name = person || 'Them';
    line.textContent = text;
    captions.appendChild(line);
    captions.scrollTop = captions.scrollHeight;
}

function formatCallTimer(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Synthesized ringtone/hangup tones — original little melodies (Web Audio
// oscillators only, nothing sampled or borrowed from any real phone/brand),
// so there's no licensing question at all. A C-major-pentatonic run for the
// ring, and a cheerful little downward run for hangup.
let ringAudioCtx = null;
let ringIntervalId = null;

function startRingtone() {
    try {
        ringAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // C major pentatonic, one octave up — no wrong notes against each
        // other however they're combined/reordered, which keeps this easy
        // to freely restyle later without it ever sounding sour.
        const notes = [523.25, 587.33, 659.25, 783.99, 880.00]; // C5 D5 E5 G5 A5
        const playRun = () => {
            if (!ringAudioCtx) return;
            const start = ringAudioCtx.currentTime;
            const step = 0.11;
            notes.forEach((freq, i) => {
                const t = start + i * step;
                const osc = ringAudioCtx.createOscillator();
                const gain = ringAudioCtx.createGain();
                osc.type = 'triangle'; // softer/rounder than a plain sine — reads as more "playful bell" than "alarm"
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.0001, t);
                gain.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + step * 1.8);
                osc.connect(gain).connect(ringAudioCtx.destination);
                osc.start(t);
                osc.stop(t + step * 2);
            });
        };
        playRun();
        ringIntervalId = setInterval(playRun, 1400);
    } catch (e) {
        // Not fatal — worst case the call just connects silently, same as
        // before this feature existed.
        console.warn('[call] ringtone failed to start:', e);
    }
}

function stopRingtone() {
    if (ringIntervalId) {
        clearInterval(ringIntervalId);
        ringIntervalId = null;
    }
    if (ringAudioCtx) {
        ringAudioCtx.close().catch(() => {});
        ringAudioCtx = null;
    }
}

// Short "call ended" flourish — same pentatonic set as the ring, played
// descending instead of ascending, so the two feel like a matched pair
// (hello / goodbye) rather than unrelated beeps.
function playHangupTone() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [880.00, 659.25, 523.25]; // A5 E5 C5 — the ring's run, backwards and trimmed
        const start = ctx.currentTime;
        const step = 0.1;
        notes.forEach((freq, i) => {
            const t = start + i * step;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.exponentialRampToValueAtTime(0.16, t + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + step * 1.6);
            osc.connect(gain).connect(ctx.destination);
            osc.start(t);
            osc.stop(t + step * 1.8);
        });
        setTimeout(() => ctx.close().catch(() => {}), 600);
    } catch (e) {
        console.warn('[call] hangup tone failed (non-fatal):', e);
    }
}

// Only actually starts listening if the call is still active, the mic
// isn't muted, and the celebrity isn't mid-reply (checked via speechQueue's
// own playing flag) — otherwise the mic would pick the TTS audio itself
// back up as if the user had spoken it.
function startCallListening() {
    if (!callModeActive || callMuted || callMicBlocked || recognitionAutoRetryDisabled) return;
    // isListening only flips true once recognition.onstart actually fires,
    // which happens asynchronously after start() is called — there's a real
    // gap where two call sites (the direct call on connect, and
    // speechQueue.onIdle firing shortly after if the greeting's queue
    // empties fast) can both pass the isListening check and both call
    // start(), which makes the browser abort one of them with a
    // now-visible-but-harmless "Mic error: aborted". recognitionStarting
    // closes that gap synchronously, before the async onstart ever fires.
    if (!recognition || isListening || recognitionStarting || speechQueue.playing) return;
    recognitionStarting = true;
    try {
        recognition.start();
        // Watchdog: onstart/onerror/onend should settle this within
        // milliseconds. If NONE of them ever fire — the `recognition` object
        // is a single instance reused for the whole page's lifetime, and can
        // apparently wedge into a state where start() neither throws nor
        // produces any event at all — recognitionStarting would otherwise
        // stay true forever, silently blocking every future listen attempt.
        // On some browsers this "no event at all" state is itself flaky:
        // onstart never fires even though the session IS actually working
        // (onresult still arrives) — a longer delay (8s comfortably outlasts
        // a normal thinking-pause) avoids treating that as trouble too soon.
        recognitionWatchdogTimer = setTimeout(() => {
            if (!recognitionStarting) return; // some real event already cleared this — nothing to do
            recognitionStarting = false;
            if (recognitionRecordFailure()) return; // breaker just tripped — don't even try aborting/restarting
            console.warn('[call] recognition.start() never settled — aborting stuck session');
            try { recognition.abort(); } catch (e) { /* already inactive — nothing to abort */ }
        }, 8000);
    } catch (e) {
        recognitionStarting = false;
        if (e.name === 'InvalidStateError') {
            // The browser insists a session is already running even though
            // we never saw onstart for it. Retrying start() here would just
            // throw the same error again — force it closed instead and let
            // onend's own re-arm logic take it from there.
            console.warn('[call] recognition already active per browser — aborting instead of retrying start()');
            try { recognition.abort(); } catch (e2) { /* ignore */ }
            return;
        }
        // Any other failure — surface it either way since a silent catch
        // here was previously indistinguishable from the mic just not working.
        console.warn('[call] recognition.start() failed:', e);
        const statusEl = document.getElementById('call-status-line');
        if (statusEl && callModeActive) statusEl.textContent = `⚠️ Could not start listening: ${e.message || e}`;
    }
}

// Swaps the call overlay's silhouette icon for a real photo — but ONLY when
// the backend confirms (via Wikipedia's own file license metadata) that the
// image is actually free to reuse; see /api/celebrity-image in app.py. Any
// non-free/fair-use/unrecognized-license image is refused server-side, so
// getting a result back here already means it's safe to show. Silently
// keeps the silhouette on any error or "not available" — this is a nice-to-
// have, never something to block or warn about if it doesn't pan out.
async function loadCallAvatar(name) {
    const avatarEl = document.getElementById('call-avatar');
    const attributionEl = document.getElementById('call-avatar-attribution');
    if (!avatarEl) return;
    avatarEl.innerHTML = '<i class="fa-solid fa-user"></i>';
    if (attributionEl) attributionEl.classList.add('d-none');
    if (!name) return;

    try {
        // Pass the current UI language so the backend can check that
        // person's home-language Wikipedia first — some names only exist
        // as an article/redirect there (e.g. "Cübbeli Ahmet Hoca" only on
        // tr.wikipedia.org), not on English Wikipedia at all.
        const wikiLang = activeLang.split('-')[0].toLowerCase();
        const resp = await fetch(`/api/celebrity-image?name=${encodeURIComponent(name)}&lang=${wikiLang}`);
        if (!resp.ok) return;
        const data = await resp.json();
        if (!data.available || !data.url) return;

        const img = new Image();
        img.alt = name;
        img.onload = () => { avatarEl.innerHTML = ''; avatarEl.appendChild(img); };
        img.onerror = () => {}; // leave the silhouette in place
        img.src = data.url;

        if (attributionEl && (data.attribution || data.license)) {
            attributionEl.textContent = `Photo: ${data.attribution || 'Wikipedia'} · ${data.license}`;
            attributionEl.classList.remove('d-none');
        }
    } catch (e) {
        console.warn('[call] avatar lookup failed (non-fatal):', e);
    }
}

// Pulls a short, current, factual summary from Wikipedia (see
// /api/celebrity-context) so the roleplay prompt knows the person's
// real-world status as of now, not just whatever the AI's own training data
// happened to know as of its cutoff. Silent no-op on any failure — the
// roleplay just falls back to relying on the model's own knowledge, same as
// before this existed.
async function loadPersonCurrentFacts(name) {
    personCurrentFacts = null;
    if (!name) return;
    try {
        const wikiLang = activeLang.split('-')[0].toLowerCase();
        const resp = await fetch(`/api/celebrity-context?name=${encodeURIComponent(name)}&lang=${wikiLang}`);
        if (!resp.ok) return;
        const data = await resp.json();
        if (data.summary) personCurrentFacts = data.summary;
    } catch (e) {
        console.warn('[call] current-facts lookup failed (non-fatal):', e);
    }
}

function setupCallMode() {
    const callBtn = document.getElementById('call-btn');
    const overlay = document.getElementById('call-overlay');
    const nameEl = document.getElementById('call-person-name');
    const statusEl = document.getElementById('call-status-line');
    const timerEl = document.getElementById('call-timer');
    const captionsEl = document.getElementById('call-captions');
    const muteBtn = document.getElementById('call-mute-btn');
    const holdTalkBtn = document.getElementById('call-hold-talk-btn');
    const cameraBtn = document.getElementById('call-camera-btn');
    const selfVideoEl = document.getElementById('call-self-video');
    const hangupBtn = document.getElementById('call-hangup-btn');
    if (!callBtn || !overlay) return;

    // Manual, always-available fallback that bypasses the browser's own
    // SpeechRecognition entirely — records raw audio locally and sends it to
    // our own server for transcription (see /api/transcribe / faster-whisper
    // in app.py). Doesn't depend on Google's free speech backend at all, so
    // it isn't affected by whatever's been causing that service to fail.
    let holdTalkRecorder = null;
    let holdTalkChunks = [];
    let holdTalkStream = null;

    async function startHoldToTalk() {
        if (holdTalkRecorder || !window.isSecureContext) return;
        try {
            holdTalkStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
            console.warn('[call] hold-to-talk mic access failed:', e);
            statusEl.textContent = '🎤 Could not access microphone for hold-to-talk.';
            return;
        }
        holdTalkChunks = [];
        holdTalkRecorder = new MediaRecorder(holdTalkStream);
        holdTalkRecorder.ondataavailable = (e) => { if (e.data.size > 0) holdTalkChunks.push(e.data); };
        holdTalkRecorder.start();
        holdTalkBtn.classList.add('call-camera-on'); // reuse the existing "active" blue-highlight style
        statusEl.textContent = '⌨️ Recording — release to send…';
    }

    async function stopHoldToTalk() {
        if (!holdTalkRecorder) return;
        const recorder = holdTalkRecorder;
        holdTalkRecorder = null;
        holdTalkBtn.classList.remove('call-camera-on');

        const stopped = new Promise((resolve) => { recorder.onstop = resolve; });
        recorder.stop();
        await stopped;
        holdTalkStream.getTracks().forEach(track => track.stop());
        holdTalkStream = null;

        const blob = new Blob(holdTalkChunks, { type: 'audio/webm' });
        holdTalkChunks = [];
        if (blob.size < 1000) { statusEl.textContent = 'Connected'; return; } // too short to be real speech — ignore

        statusEl.textContent = '⌨️ Transcribing…';
        try {
            const formData = new FormData();
            formData.append('audio', blob, 'clip.webm');
            const langCode = activeLang.split('-')[0].toLowerCase();
            const resp = await fetch(`/api/transcribe?language=${langCode}`, { method: 'POST', body: formData });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
            statusEl.textContent = 'Connected';
            if (data.text && data.text.trim()) {
                processVoiceCommand(data.text.trim());
            }
        } catch (e) {
            console.error('[call] transcription failed:', e);
            statusEl.textContent = '⚠️ Transcription failed — try again.';
        }
    }

    if (holdTalkBtn) {
        // Press-and-hold on both mouse and touch — mirrors a real
        // walkie-talkie/push-to-talk interaction, which is exactly the
        // metaphor here (record while held, send on release).
        holdTalkBtn.addEventListener('mousedown', startHoldToTalk);
        holdTalkBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startHoldToTalk(); });
        holdTalkBtn.addEventListener('mouseup', stopHoldToTalk);
        holdTalkBtn.addEventListener('mouseleave', stopHoldToTalk); // dragging off the button while held still sends what was recorded so far
        holdTalkBtn.addEventListener('touchend', (e) => { e.preventDefault(); stopHoldToTalk(); });
    }

    // Your own webcam, shown only to you — a self-view like FaceTime/Zoom's
    // corner preview. Nothing here is a synthetic video of the character;
    // the stream never leaves this browser tab (no upload, no recording).
    // Off by default each call — camera access is more sensitive than mic,
    // so it should be an explicit opt-in tap, not something that auto-starts.
    let selfVideoStream = null;

    async function toggleSelfCamera() {
        if (selfVideoStream) {
            selfVideoStream.getTracks().forEach(track => track.stop());
            selfVideoStream = null;
            selfVideoEl.srcObject = null;
            selfVideoEl.classList.add('d-none');
            cameraBtn.classList.remove('call-camera-on');
            cameraBtn.innerHTML = '<i class="fa-solid fa-video-slash"></i>';
            cameraBtn.title = 'Turn camera on';
            return;
        }
        if (!window.isSecureContext) {
            // Same HTTPS/localhost restriction as the microphone — camera
            // access is refused outright over plain http:// on anything but
            // localhost.
            statusEl.textContent = '📷 Camera needs HTTPS (blocked over plain http://).';
            return;
        }
        try {
            selfVideoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            selfVideoEl.srcObject = selfVideoStream;
            selfVideoEl.classList.remove('d-none');
            cameraBtn.classList.add('call-camera-on');
            cameraBtn.innerHTML = '<i class="fa-solid fa-video"></i>';
            cameraBtn.title = 'Turn camera off';
        } catch (e) {
            console.warn('[call] camera access failed:', e);
            statusEl.textContent = '📷 Could not access camera — check browser permissions.';
        }
    }

    function stopSelfCamera() {
        if (selfVideoStream) {
            selfVideoStream.getTracks().forEach(track => track.stop());
            selfVideoStream = null;
        }
        selfVideoEl.srcObject = null;
        selfVideoEl.classList.add('d-none');
        cameraBtn.classList.remove('call-camera-on');
        cameraBtn.innerHTML = '<i class="fa-solid fa-video-slash"></i>';
        cameraBtn.title = 'Turn camera on';
    }

    if (cameraBtn) cameraBtn.addEventListener('click', toggleSelfCamera);

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        callBtn.disabled = true;
        callBtn.title = 'Calling needs a browser with microphone speech recognition (Chrome/Edge).';
        return;
    }
    // Same secure-context requirement as getUserMedia (see create-character.js)
    // — SpeechRecognition also refuses mic access outside HTTPS/localhost.
    // Over a plain http:// tunnel or LAN IP this fails silently with no
    // error event at all, which is exactly what "connects but total silence"
    // looks like from the user's side.
    if (!window.isSecureContext) {
        callBtn.disabled = true;
        callBtn.title = 'Calling needs HTTPS (microphone access is blocked over plain http://).';
        // A disabled icon + hover tooltip is easy to miss entirely (that's
        // exactly what happened) — put the same explanation in a banner
        // that's visible without hovering, same pattern as the mic-recording
        // banner on create-character.js.
        const localUrl = `http://localhost:${window.location.port || 5005}${window.location.pathname}${window.location.search}`;
        const banner = document.createElement('div');
        banner.className = 'alert alert-warning mt-2';
        banner.style.maxWidth = '520px';
        banner.style.margin = '0.5rem auto';
        banner.innerHTML = `<strong>📞 Calling is blocked here.</strong> You're loading this page from ` +
            `<code>${window.location.host}</code>, and browsers only allow microphone access over HTTPS or ` +
            `<code>localhost</code>. Open <a href="${localUrl}">${localUrl}</a> instead, or use this site's ` +
            `HTTPS address if it has one.`;
        const header = document.querySelector('.chat-header');
        if (header) header.insertAdjacentElement('afterend', banner);
        console.warn('[call] insecure context — call disabled. location:', window.location.href);
        return;
    }

    function endCall() {
        const wasActive = callModeActive; // don't play the tone if there was never actually a call to end (e.g. stray extra hangup-click)
        callModeActive = false;
        callMuted = false;
        speechQueue.onIdle = null;
        clearInterval(callTimerInterval);
        clearTimeout(recognitionCooldownTimer); // don't let a pending backoff retry fire into a call that's already over
        stopRingtone();
        if (wasActive) playHangupTone();
        if (isListening && recognition) recognition.stop();
        stopAllAudios();
        stopSelfCamera(); // never leave the camera light on after hanging up
        overlay.classList.add('d-none');
        overlay.classList.remove('call-connected');
        muteBtn.classList.remove('call-muted');
        muteBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
    }

    function startCall() {
        if (!person) return; // no character loaded yet — nothing to call
        // Guards against a double-click/double-tap (or any other way this
        // gets invoked twice) starting two overlapping calls — each one
        // would independently generate and speak its own greeting, which is
        // exactly what showed up as the same greeting appearing twice.
        if (callModeActive) return;
        callModeActive = true;
        callMuted = false;
        callMicBlocked = false;
        recognitionErrorTimestamps = []; // a previous call's failures shouldn't block a fresh one
        recognitionAutoRetryDisabled = false;
        recognitionBackoffAttempt = 0;
        clearTimeout(recognitionCooldownTimer);
        conversationHistory = []; // fresh call, fresh context
        nameEl.textContent = person;
        statusEl.textContent = 'Calling…';
        timerEl.classList.add('d-none');
        captionsEl.innerHTML = '';
        overlay.classList.remove('d-none', 'call-connected');
        startRingtone();
        loadCallAvatar(person);

        // Make sure the reply actually gets spoken even if the user never
        // toggled voice on manually — the whole point of a call is voice.
        if (!isVoiceEnabled) {
            isVoiceEnabled = true;
            if (toggleVoiceBtn) {
                toggleVoiceBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                toggleVoiceBtn.classList.remove('btn-secondary');
                toggleVoiceBtn.classList.add('btn-success');
            }
        }

        // Brief "ringing" beat before connecting — purely cosmetic, matches
        // how an actual call feels instead of snapping straight to "live."
        setTimeout(() => {
            if (!callModeActive) return; // hung up during the ring
            stopRingtone();
            overlay.classList.add('call-connected');
            statusEl.textContent = 'Connected';
            timerEl.classList.remove('d-none');
            let elapsed = 0;
            timerEl.textContent = formatCallTimer(0);
            callTimerInterval = setInterval(() => {
                elapsed += 1;
                timerEl.textContent = formatCallTimer(elapsed);
            }, 1000);

            // Once connected, listening auto-resumes whenever the speech
            // queue drains (i.e. after each reply after this one finishes).
            speechQueue.onIdle = startCallListening;
            // Start listening for the caller RIGHT NOW, in parallel with the
            // greeting's generation+playback — not after it. Waiting for the
            // greeting first was adding the greeting's full 30-90s
            // generation time on top of playback before the mic ever
            // activated, which is exactly backwards for a phone call: you
            // don't have to wait for someone to finish their "hello" before
            // you're allowed to start talking. The trade-off is that if
            // you're on speakers (not headphones) during the greeting, the
            // mic can pick up its audio — same trade-off a real speakerphone
            // call has.
            startCallListening();
            playCallGreeting();
        }, 1500);
    }

    // A real call opens with the person who picked up saying something —
    // waiting in silence for the *caller* to speak first (what this did
    // before) reads as broken, not as "your turn." Generates one short
    // in-character opening line through the same AI + cloned-voice pipeline
    // as every other reply, then lets the normal onIdle hook take over.
    async function playCallGreeting() {
        if (!callModeActive || greetingInFlight) return;
        greetingInFlight = true;
        try {
            await celebrityVoiceReadyPromise;
            if (!callModeActive) return; // hung up while that resolved
            const langCode = activeLang.split('-')[0].toLowerCase();
            const replyLang = LANG_CODE_TO_NAME[langCode] || 'English';
            const currentFactsNote = personCurrentFacts
                ? ` Here is a short, current, factual summary of who you are right now — stay consistent with it: "${personCurrentFacts}". Note: you may be referred to here by a different name/title than the one in that summary (e.g. a nickname vs. a formal name) — they are the same person; always respond in-character as ${person}, the name you're being addressed as.`
                : '';
            const greetingPrompt = characterPersonality
                ? `You are ${person}, a character described as: ${characterPersonality}. The user just called you on the phone. Greet them warmly and briefly in first person, then ask what's on their mind. 1-2 short sentences.`
                : `You are role-playing as ${person}. The user just called you on the phone.${currentFactsNote} Greet them warmly and briefly in first person as ${person}, then ask what's on their mind. 1-2 short sentences.`;
            const greetingText = await getGeminiResponse(greetingPrompt, null, replyLang);
            if (!callModeActive) return;
            const cleaned = greetingText.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
            appendMessage(`${person}: ${cleaned}`, 'bot-message');
            updateCallCaption('them', cleaned);
            playBotResponseAudio(cleaned); // queues TTS; onIdle fires startCallListening once it finishes
        } catch (e) {
            console.error('[call] greeting failed:', e);
            statusEl.textContent = '⚠️ Could not generate greeting — go ahead and speak.';
            startCallListening(); // don't leave the call stuck silent if the greeting itself failed
        } finally {
            greetingInFlight = false;
        }
    }

    callBtn.addEventListener('click', startCall);
    hangupBtn.addEventListener('click', endCall);
    muteBtn.addEventListener('click', () => {
        callMuted = !callMuted;
        muteBtn.classList.toggle('call-muted', callMuted);
        muteBtn.innerHTML = callMuted
            ? '<i class="fa-solid fa-microphone-slash"></i>'
            : '<i class="fa-solid fa-microphone"></i>';
        if (callMuted && isListening && recognition) {
            recognition.stop();
        } else if (!callMuted) {
            startCallListening();
        }
    });

    // Esc as a natural "hang up" shortcut while the overlay has focus.
    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') endCall();
    });
}

// settig he URL singerName userInput placeholder
document.addEventListener('DOMContentLoaded', () => {

   const loggedInUserIdentifier = localStorage.getItem('loggedInUserIdentifier');
    if (!loggedInUserIdentifier) {
        // If no user is logged in, redirect them to the login page.
        window.location.href = 'login.html';
        return; // Stop running the rest of the function
    }

    applyChatTranslations();


    readFromQuerystring();
    setupCelebrityVoicePicker();
    setupCallMode();
    celebrityVoiceReadyPromise = characterId ? loadCustomCharacter() : autoMatchCelebrityVoice();
    // Warm both the server-side license-check cache and the browser's own
    // image cache as soon as we know who this chat is with, instead of
    // waiting until the call button is pressed — that's what was showing up
    // as a multi-second delay right as the call UI opened. `person` is only
    // guaranteed set once this resolves (custom characters set it inside
    // loadCustomCharacter itself).
    celebrityVoiceReadyPromise.then(() => loadCallAvatar(person));
    // Only for real people, not user-invented custom characters — a made-up
    // character's Wikipedia lookup would either find nothing or, worse,
    // accidentally match an unrelated real person of the same name.
    celebrityVoiceReadyPromise.then(() => { if (!characterId) loadPersonCurrentFacts(person); });

    // Auto-enable voice when on a celebrity chat page
    if (person && toggleVoiceBtn && !isVoiceEnabled) {
        isVoiceEnabled = true;
        toggleVoiceBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        toggleVoiceBtn.classList.remove('btn-secondary');
        toggleVoiceBtn.classList.add('btn-success');
    }

    const welcomeHeading = document.getElementById('famouse-show');
    if (person && welcomeHeading) {
        welcomeHeading.innerHTML = `${person} 🎤`;
        window.document.title = `Chat with ${person} `;
        // settting the placeholder for user input
        const userInputElement = document.getElementById('user-input');
        if (userInputElement) {
            userInputElement.placeholder = person;
        }
    }

    // 3. Set the navbar title to the person name or a default.
    document.querySelector('.navbar-brand').innerHTML = person || 'IboChat';

    // 4. Assign all other elements and listeners now that the page is loaded.


    const navbarCollapseDiv = document.getElementById('professionalNavbar');
    if (navbarCollapseDiv) {
        chatListUl = navbarCollapseDiv.querySelector('ul.navbar-nav');
    }

    if (toggleVoiceBtn) {
        toggleVoiceBtn.addEventListener('click', () => {
            isVoiceEnabled = !isVoiceEnabled;
            if (isVoiceEnabled) {
                toggleVoiceBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                toggleVoiceBtn.classList.remove('btn-secondary');
                toggleVoiceBtn.classList.add('btn-success');
                console.log('AI voice has been enabled.');
            } else {
                stopAllAudios();
                toggleVoiceBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                toggleVoiceBtn.classList.remove('btn-success');
                toggleVoiceBtn.classList.add('btn-secondary');
                console.log('AI voice has been disabled.');
            }
        });
    }

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = activeLang;

        recognition.onstart = () => {
            isListening = true;
            recognitionStarting = false;
            clearTimeout(recognitionWatchdogTimer);
            // Deliberately NOT counted as a breaker-clearing success here —
            // starting successfully doesn't guarantee this session will ever
            // produce a real transcript (that's exactly the fail-loop that
            // was slipping past the old logic). Only onresult, below, counts.
            microphoneBtn.classList.add('btn-success');
            microphoneBtn.classList.remove('btn-secondary');
            speechRecognitionStatus.textContent = 'Dinliyorum...';
        };

        recognition.onresult = (event) => {
            // Proof of life, independent of onstart — on this browser onstart
            // has been observed never firing at all even while recognition is
            // genuinely working, which made the watchdog above wrongly abort
            // an active, listening session mid-sentence. A result (even
            // interim, not yet final) is unambiguous evidence the session is
            // real and working, so treat it exactly like onstart for this
            // purpose.
            recognitionStarting = false;
            recognitionRecordSuccess();
            clearTimeout(recognitionWatchdogTimer);

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
            // The call overlay covers the whole page — speechRecognitionStatus
            // above lives underneath it and is never actually visible during a
            // call. Previously that meant total silence in the UI while
            // listening: nothing confirmed the mic was even hearing you until
            // a final transcript suddenly appeared. Mirror the live,
            // still-being-recognized words into the call status line instead,
            // so it's visibly listening in real time, not just "Connected"
            // with no feedback.
            if (callModeActive) {
                const callStatusEl = document.getElementById('call-status-line');
                if (callStatusEl && interimTranscript) callStatusEl.textContent = `🎤 ${interimTranscript}`;
            }
            if (finalTranscript) {
                speechRecognitionStatus.textContent = '';
                processVoiceCommand(finalTranscript);
                recognition.stop();
            }
        };

        recognition.onend = () => {
            isListening = false;
            recognitionStarting = false;
            clearTimeout(recognitionWatchdogTimer);
            microphoneBtn.classList.remove('btn-success');
            microphoneBtn.classList.add('btn-secondary');
            speechRecognitionStatus.textContent = '';
            // In a call, recognition also ends on silence/timeout with no
            // result (not just after a successful transcript) — without this,
            // the call would go dead-silent forever the first time nothing
            // was heard. Only re-arm if the celebrity isn't about to/already
            // speaking (that path is handled by speechQueue.onIdle instead)
            // AND the breaker hasn't tripped — otherwise this exact 300ms
            // retry is what turned a broken speech service into 150+ errors
            // in seconds with no way to stop.
            if (callModeActive && !callMuted && !speechQueue.playing && !recognitionAutoRetryDisabled) {
                setTimeout(startCallListening, 300);
            }
        };

        recognition.onerror = (event) => {
            isListening = false;
            recognitionStarting = false;
            // Every error counts against the breaker now, even the routine
            // 'aborted'/'no-speech' ones — this was the actual bug: those
            // used to unconditionally reset the old streak counter, which is
            // exactly how a fast fail-loop (instant error every single
            // attempt) never tripped anything and just kept retrying every
            // 300ms via onend below, racking up 150+ errors with no breaker
            // ever engaging. Only a genuine transcript (onresult) counts as
            // proof of health now.
            recognitionRecordFailure();
            clearTimeout(recognitionWatchdogTimer);
            microphoneBtn.classList.remove('btn-success');
            microphoneBtn.classList.add('btn-secondary');
            // No longer logged as a red console.error — 'aborted'/'no-speech'
            // fire routinely during completely normal use (see the 'benign'
            // list below), and console.error is exactly what was showing up
            // as a scary red line every single time, even though nothing was
            // actually broken. recognitionRecordFailure() above still tracks
            // it for the backoff/recovery logic — only the visible logging
            // is gone, not the actual handling.
            // Previously silent — a mic-permission block or an insecure
            // context (recognition needs HTTPS/localhost, same as
            // getUserMedia) failed here with nothing shown anywhere, which
            // is exactly what "total silence, nothing happens" looks like.
            // Fatal errors (permission denied, no mic, blocked by browser
            // policy) shouldn't auto-retry either — that would just re-prompt
            // forever — only transient ones like "no-speech" should.
            const fatal = ['not-allowed', 'service-not-allowed', 'audio-capture'].includes(event.error);
            if (fatal) callMicBlocked = true;
            // 'aborted' and 'no-speech' are routine, not failures — 'aborted'
            // fires as a normal side-effect of this code's own
            // recognition.stop() call right after a final transcript (the
            // session is often already ending on its own by then), and
            // 'no-speech' just means nobody said anything before the
            // timeout. Surfacing either as a scary "Mic error" banner was
            // alarming for something the call recovers from automatically
            // (see onend below) — only show a message for something actually
            // unexpected.
            const benign = ['aborted', 'no-speech'].includes(event.error);
            if (callModeActive) {
                const statusEl = document.getElementById('call-status-line');
                if (statusEl && !benign) {
                    statusEl.textContent = fatal
                        ? `🎤 Microphone blocked (${event.error}) — allow mic access for this site and call again.`
                        : `⚠️ Mic error: ${event.error}`;
                }
            } else if (!benign) {
                speechRecognitionStatus.textContent = fatal
                    ? `Microphone blocked (${event.error}) — check browser permissions.`
                    : '';
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
            microphoneBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
            speechRecognitionStatus.textContent = 'Browser does not support speech recognition.';
        }
    }

    if (chatForm) {
        chatForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const userMessageText = userInput.value.trim();
            await handleUserMessage(userMessageText);
        });
    }

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

    if (newChatBtn) {
        newChatBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const currentActive = document.querySelector('.nav-link.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            const newChatLink = addNewChatToNavbar();
            newChatLink.classList.add('active');
            switchChat(newChatLink.dataset.chatId);
            conversationHistory = []; // don't drag old context into a fresh chat
        });
    }

    if (navbarCollapseDiv) {
        navbarCollapseDiv.addEventListener('click', (event) => {
            const chatLink = event.target.closest('a.nav-link[data-chat-id]');
            if (chatLink && chatLink.id !== 'new-chat-btn') {
                event.preventDefault();
                const currentActive = navbarCollapseDiv.querySelector('.nav-link.active');
                if (currentActive) currentActive.classList.remove('active');
                chatLink.classList.add('active');
                switchChat(chatLink.dataset.chatId);
            }
        });
    }

    function addNewChatToNavbar(chatTitle = 'New Chat', chatId = `chat-${Date.now()}`) {
        const newNavItem = document.createElement('li');
        newNavItem.className = 'nav-item';
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = '#';
        link.dataset.chatId = chatId;
        link.innerHTML = `<i class="fa-regular fa-comment me-2"></i>${chatTitle}`;
        newNavItem.appendChild(link);
        const userMenu = document.getElementById('navbarUserMenu')?.closest('li.nav-item.dropdown');
        if (userMenu) {
            userMenu.parentElement.insertBefore(newNavItem, userMenu);
        } else {
            const primaryNav = document.querySelector('.navbar-nav.me-auto');
            primaryNav.appendChild(newNavItem);
        }
        return link;
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
        btnToggle.addEventListener('click', (event) => {
            event.preventDefault();
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
});