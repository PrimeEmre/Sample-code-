function readCode() {
    // setting the veribles 
    const codeInput = document.getElementById("codeInput").value
    const apiKey = `AIzaSyDnvdyTV8r4bUv3BiCkvmJ9QTflZWiJcRU`
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
    // setting the prompt
    const requestBody = {
        contents: [{
            parts: [{ text: "Explain this code simply:" + codeInput }]
        }]
    }
    try {
        // sending the requeset 
        const requeset = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        })
        // Getting the answers 
        
    }
}