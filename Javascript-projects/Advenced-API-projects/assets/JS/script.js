async function readCode() {
    // 1. Get the user's code
    const userCode = document.getElementById('codeInput').value;
    const resultBox = document.getElementById('result')

    // Basic validation
    if (!userCode.trim()) {
        alert("Please paste some code first!")
        return;
    }

    resultBox.innerText = "Thinking... (This might take a few seconds)";

    const apiKey = "AIzaSyDnvdyTV8r4bUv3BiCkvmJ9QTflZWiJcRU"
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    // 3. The Request Body (Required by Google)
    const requestBody = {
        contents: [{
            parts: [{ 
                text: "Explain this code simply and clearly for a beginner:\n\n" + userCode 
            }]
        }]
    };

    try {
        // 4. The Fetch Call
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        // 5. Check for Errors
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`API Error: ${errorData.error.message}`)
        }

        // 6. Get the Answer
        const data = await response.json();
        const explanation = data.candidates[0].content.parts[0].text

        // 7. Show the Result
        resultBox.innerText = explanation

    } catch (error) {
        console.error("Error details:", error)
        resultBox.innerText = "Error: " + error.message
    }
}