// Load voices from ElevenLabs when page opens
loadVoices();

async function loadVoices() {
    try {
        const response = await fetch("/voices");
        const data     = await response.json();
        const select   = document.getElementById("voice-select");

        select.innerHTML = "";

        data.voices.forEach(voice => {
            const option       = document.createElement("option");
            option.value       = voice.id;
            option.textContent = voice.name;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Could not load voices:", error);
    }
}

// Character counter
document.getElementById("text-input").addEventListener("input", function() {
    document.getElementById("char-count").textContent = this.value.length;
});

// Playback speed slider
document.getElementById("rate").addEventListener("input", function() {
    document.getElementById("rate-value").textContent = parseFloat(this.value).toFixed(1) + "x";
});

// Main button click
document.getElementById("action-btn").addEventListener("click", synthesizeSpeech);

async function synthesizeSpeech() {
    const text     = document.getElementById("text-input").value.trim();
    const voice_id = document.getElementById("voice-select").value; // ← changed from lang to voice_id
    const rate     = parseFloat(document.getElementById("rate").value);
    const btn      = document.getElementById("action-btn");

    if (!text) {
        showError("Please enter some text first!");
        return;
    }

    btn.disabled = true;
    btn.querySelector(".btn-text").textContent = "Generating...";
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("error-msg").classList.add("hidden");
    document.getElementById("audio-section").classList.add("hidden");

    try {
        const response = await fetch("/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text, voice_id: voice_id }) // ← changed lang to voice_id
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Something went wrong");
        }

        const audioBlob     = await response.blob();
        const audioUrl      = URL.createObjectURL(audioBlob);
        const player        = document.getElementById("audio-player");
        player.src          = audioUrl;
        player.playbackRate = rate;
        player.play();

        document.getElementById("download-btn").href = audioUrl;
        document.getElementById("audio-section").classList.remove("hidden");

    } catch (error) {
        showError("Error: " + error.message);
    }

    btn.disabled = false;
    btn.querySelector(".btn-text").textContent = "🎙️ Synthesize Speech";
    document.getElementById("loading").classList.add("hidden");
}

function showError(message) {
    const err = document.getElementById("error-msg");
    err.textContent = message;
    err.classList.remove("hidden");
}