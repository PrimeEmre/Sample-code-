'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageDiv = document.getElementById('message');

    /**
     * 1. SHOW/HIDE PASSWORD LOGIC
     * Finds all buttons with class 'toggle-password' and switches input types
     */
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const inputField = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (inputField.type === 'password') {
                inputField.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                inputField.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    /**
     * 2. REGISTRATION FORM SUBMISSION
     */
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear and hide message box at start of new attempt
            messageDiv.innerHTML = '';
            messageDiv.style.display = 'none';

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            // Client-side validation: Password Match
            if (password !== confirmPassword) {
                showMessage("Passwords do not match.", "danger");
                return;
            }

            try {
                // FIXED: Using relative path /api/register instead of 127.0.0.1
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    showMessage(result.message || "Account created successfully! Redirecting to login...", "success");
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2500);
                } else {
                    showMessage(result.error || "Registration failed.", "danger");
                }
            } catch (error) {
                console.error('Registration Error:', error);
                showMessage("Connection error. Please ensure the server is running.", "danger");
            }
        });
    }

    /**
     * Helper function to display Bootstrap alerts
     */
    function showMessage(text, type) {
        messageDiv.innerHTML = `<div class="alert alert-${type} py-2 small">${text}</div>`;
        messageDiv.style.display = 'block';
    }
});