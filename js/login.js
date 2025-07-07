// Form switching
function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registrationForm").style.display = "none";
  document.getElementById("registrationFormElement").reset();
}

function showRegistration() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registrationForm").style.display = "block";
  document.getElementById("loginFormElement").reset();
}

// Password visibility toggle
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";
    button.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
  } else {
    input.type = "password";
    button.innerHTML = `<i class="fa-solid fa-eye"></i>`;
  }
}

// Auto-focus first input
document.getElementById("loginEmail").focus();

// Validate Confirm password
const passwordInput = document.getElementById("registerPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const errorMsg = document.getElementById("errorMessage");

function validatePassword() {
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  // Match check
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  } else {
    return true;
  }
}

