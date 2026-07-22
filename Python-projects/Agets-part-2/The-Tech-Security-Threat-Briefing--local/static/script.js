document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', dateOpts);

    const generateBtn = document.getElementById('generate-btn');
    const topicInput = document.getElementById('topic-input');
    const contentDiv = document.getElementById('newsletter-content');
    const statusText = document.getElementById('system-status');
    const sourceDisplay = document.getElementById('source-display');
    const latencyDisplay = document.getElementById('latency-display');

    generateBtn.addEventListener('click', async () => {
        const topic = topicInput.value.trim();
        if (!topic) return;

        // UI Loading State
        generateBtn.disabled = true;
        generateBtn.innerText = "GATHERING INTEL...";
        statusText.innerText = "AGENTS DEPLOYED";
        contentDiv.innerHTML = `<div class="placeholder">> Connecting to neural network...<br>> Scraping latest threat vectors for: ${topic}...</div>`;
        sourceDisplay.innerText = "Processing...";
        latencyDisplay.innerText = "Calculating...";

        const startTime = Date.now();

        try {
            const response = await fetch('/generate-briefing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic })
            });

            const data = await response.json();

            if (response.ok) {
                // Success: Convert Markdown to HTML using Marked.js
                contentDiv.innerHTML = marked.parse(data.newsletter);
                
                // SMART METRICS: Display the new data from the Python backend
                let sourceInfo = data.source;
                if (data.model) {
                    sourceInfo += ` | Model: ${data.model}`;
                }
                if (data.cached) {
                    sourceInfo += ` ⚡ CACHED`;
                }
                sourceDisplay.innerText = sourceInfo;

            } else {
                // Error Handling (Now includes Rate Limiting!)
                let errorMsg = data.error || "Unknown error occurred.";
                
                // If the backend returns 429, it means the user is spamming the button
                if (response.status === 429) {
                    errorMsg = "Rate limit exceeded. Please wait 60 seconds before generating another briefing.";
                    statusText.innerText = "RATE LIMITED";
                } else {
                    statusText.innerText = "ERROR";
                }
                
                contentDiv.innerHTML = `<div class="placeholder" style="color: #ff4444;">> ERROR: ${errorMsg}</div>`;
                sourceDisplay.innerText = "Failed";
            }
        } catch (error) {
            contentDiv.innerHTML = `<div class="placeholder" style="color: #ff4444;">> CRITICAL ERROR: Connection to server lost.</div>`;
            sourceDisplay.innerText = "Offline";
            statusText.innerText = "OFFLINE";
        } finally {
            // Restore UI State
            generateBtn.disabled = false;
            generateBtn.innerText = "GENERATE BRIEFING";
            if (statusText.innerText !== "RATE LIMITED" && statusText.innerText !== "ERROR" && statusText.innerText !== "OFFLINE") {
                statusText.innerText = "SYSTEM IDLE";
            }
            
            const endTime = Date.now();
            latencyDisplay.innerText = `${((endTime - startTime) / 1000).toFixed(1)}s`;
        }
    });
});