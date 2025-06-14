<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">Login</h1>
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
      </div>
      <div v-if="error" class="error-msg"></div>
      <div class="button-group">
        <button @click="login" class="btn">Login</button>
        <a href="#/register" class="btn">Register</a>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
  error.value = ''
  try {
    const res = await axios.post('/api/login', {
      email: email.value,
      password: password.value
    })
    const message = res.data.message
    if (message === 'Login successful') {
      if (res.data.user) {
        sessionStorage.setItem('user', JSON.stringify(res.data.user))
        window.location.href = '#'
      }
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  }
}


</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.login-card {
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
  border-bottom: 1px solid #d1d5db;
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
  text-align: center;
  margin-top: 0.5rem;
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

router-link {
  text-decoration: none;
  text-align: center;
}
</style>
