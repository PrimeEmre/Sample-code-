'use strict';

// Shared local (browser-side) storage for audio blobs — IndexedDB, not
// localStorage, because localStorage only holds small text strings and
// can't safely store binary audio data. This is what "local storage" means
// in practice for audio: it lives on the user's own device, survives page
// reloads, and needs no server round-trip once cached.
const IboAudioStore = (() => {
    const DB_NAME = 'ibochat-audio';
    const STORE = 'clips';
    let dbPromise = null;

    function openDb() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = () => {
                req.result.createObjectStore(STORE);
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
        return dbPromise;
    }

    async function get(key) {
        try {
            const db = await openDb();
            return await new Promise((resolve, reject) => {
                const tx = db.transaction(STORE, 'readonly');
                const req = tx.objectStore(STORE).get(key);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.warn('[audio-store] get failed:', e);
            return null;
        }
    }

    async function set(key, blob) {
        try {
            const db = await openDb();
            await new Promise((resolve, reject) => {
                const tx = db.transaction(STORE, 'readwrite');
                tx.objectStore(STORE).put(blob, key);
                tx.oncomplete = resolve;
                tx.onerror = () => reject(tx.error);
            });
        } catch (e) {
            console.warn('[audio-store] set failed:', e);
        }
    }

    // Cheap, deterministic key for a /speak request — same text + voice +
    // language always maps to the same cache entry, so repeating a line
    // (or reloading the page) plays instantly from disk instead of
    // re-generating on the server.
    function speakKey(text, voiceId, language) {
        return `speak::${voiceId || 'default'}::${language || ''}::${text}`;
    }

    return { get, set, speakKey };
})();
