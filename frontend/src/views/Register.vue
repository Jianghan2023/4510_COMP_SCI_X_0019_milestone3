<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="title">Register</h1>
      <span class="subtitle">Welcome to Global Taste Bridge :)</span>
      <div class="form-group">
        <label for="email" class="label">Email:</label>
        <input
          id="email"
          type="email"
          class="input"
          v-model="email"
        >
      </div>
      <div class="form-group">
        <label for="password" class="label">Password:</label>
        <input
          id="password"
          type="password"
          class="input"
          v-model="password"
        >
        <div v-if="password" class="strength-msg">
          password security:
          <span :class="`strength-${passwordStrength.toLowerCase()}`">{{ passwordStrength }}</span>
        </div>
      </div>
      <div class="form-group">
        <label for="confirmPassword" class="label">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          class="input"
          v-model="confirmPassword"
        >
      </div>
      <div v-if="password !== confirmPassword" class="error-msg">Passwords do not match</div>
      <div v-if="error" class="error-msg">
        {{ error }}
      </div>
      <div v-else-if="error" class="error-msg"></div>
      <div class="button-group">
        <button
          @click="register"
          :disabled="password !== confirmPassword"
          class="btn"
        >
          Register
        </button>
        <a href="#/login" class="btn">Login</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const passwordStrength = ref('')

function calculatePasswordStrength(pwd) {
  if (pwd.length < 6) return 'weak'
  
  const hasLetters = /[a-zA-Z]/.test(pwd)
  const hasNumbers = /\d/.test(pwd)
  const hasSymbols = /[!@#$%^&*()_+{}|:"<>?~`\-=[\]\\;',./]/.test(pwd)
  const complexity = [hasLetters, hasNumbers, hasSymbols].filter(Boolean).length

  if (complexity < 2) return 'weak'
  if (complexity === 2) return 'medium'
  return 'strong'
}

watch(password, (newVal) => {
  passwordStrength.value = newVal ? calculatePasswordStrength(newVal) : ''
})

async function register() {
  error.value = ''
  try {
    await axios.post('/api/register', {
      email: email.value,
      password: password.value,
    })
    window.location.replace('#/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Please register again'
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.register-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 24rem;
  border-bottom: 2px solid #dc2626;
}

.title {
  font-size: 2.25rem;
  font-weight: bold;
}

.subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0.5rem 0 2rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
  outline: none;
}

.input:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(248,113,113,0.1);
}

.error-msg {
  color: #dc2626;
  margin: 0.5rem 0;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  flex: 1;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #dc2626;
  cursor: pointer;
}

.btn:hover {
  background-color: #b91c1c;
}

.btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

a {
  text-decoration: none;
  text-align: center;
}

.strength-msg {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
.strength-weak {
  color: #dc2626;
}
.strength-medium {
  color: #f59e0b;
}
.strength-strong {
  color: #059669;
}
</style>
