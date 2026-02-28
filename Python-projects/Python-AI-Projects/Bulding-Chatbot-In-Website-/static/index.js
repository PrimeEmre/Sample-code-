const textarea = document.querySelector("textarea");
const sendButton = document.querySelector(".send-button");

// send on Enter key
textarea.addEventListener("keydown", function(e) {
    if (e.key == "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
    }
})

// send on button click
sendButton.addEventListener("click", sendMessage);

//  send message to Flask ──
async function sendMessage() {
    const message = textarea.value.trim()
    if (!message) return

    textarea.value = ""
    addMessage("user", message)
    showTyping(true)

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        showTyping(false);
        addMessage("bot", data.response)

    } catch (error) {
        showTyping(false);
        addMessage("bot", "Error: Make sure Ollama is running!");
    }
}

function addMessage(role, text) {
    const container = document.querySelector(".conversation-container")
    const wrapper = document.createElement("div")
    wrapper.className = `message-wrapper ${role}`

    const content = document.createElement("div")
    content.className = "message-content"
    content.textContent = text

    wrapper.appendChild(content)
    container.appendChild(wrapper)

    container.scrollTop = container.scrollHeight
}


function showTyping(visible) {
    const existing = document.getElementById("typingIndicator")
    if (existing) existing.remove()

    if (visible) {
        const container = document.querySelector(".conversation-container")
        const wrapper = document.createElement("div")
        wrapper.className = "message-wrapper bot"
        wrapper.id = "typingIndicator"

        const content = document.createElement("div")
        content.className = "message-content"
        content.textContent = "Jarvis is thinking..."
        content.style.color = "#9b9b9b"
        content.style.fontStyle = "italic"

        wrapper.appendChild(content)
        container.appendChild(wrapper)
        container.scrollTop = container.scrollHeight
    }
}