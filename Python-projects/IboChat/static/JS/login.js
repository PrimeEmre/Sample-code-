'use strict';

const GOOGLE_CLIENT_ID = "1044722351078-tlg7qehp27n6so3ul0r3h07sa9hqujck.apps.googleusercontent.com";

// Called by Google SDK once it finishes loading (see Login.html onload attribute)
function initGoogleSignIn() {
    const container = document.getElementById("google-btn");
    if (!container) return;
    try {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse
        });
        google.accounts.id.renderButton(container, {
            theme: "outline", size: "large", type: "standard", shape: "pill"
        });
    } catch (err) {
        container.innerHTML = '<small class="text-danger">Google Sign-In unavailable for this domain.</small>';
        console.error("Google Sign-In init failed:", err);
    }
}

function handleGoogleCredentialResponse(response) {
    try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        localStorage.setItem('loggedInUserIdentifier', payload.email || payload.name);
        localStorage.setItem('loggedInUserType', 'google');
        window.location.href = 'index.html';
    } catch (err) {
        showLoginError("Google login failed. Please try again.");
        console.error("Google credential decode failed:", err);
    }
}

function showLoginError(message) {
    const div = document.getElementById("profileinfo");
    if (!div) return;
    div.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    div.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    // Already logged in → go straight to app
    if (localStorage.getItem('loggedInUserIdentifier')) {
        window.location.href = 'index.html';
        return;
    }

    const loginForm    = document.querySelector(".login-form");
    const loginButton  = document.querySelector(".login-button");
    const emailInput   = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email    = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showLoginError("Please fill in both email and password.");
            return;
        }

        // Loading state
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = "Logging in…";
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('loggedInUserIdentifier', email);
                localStorage.setItem('loggedInUserType', 'email');
                window.location.href = 'index.html';
            } else {
                showLoginError(result.error || 'Login failed. Check your credentials.');
            }
        } catch (err) {
            showLoginError("Cannot reach the server. Make sure the app is running.");
            console.error("Login fetch error:", err);
        } finally {
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.textContent = "Login";
            }
        }
    });
});
