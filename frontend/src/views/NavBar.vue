<template>
  <nav class="nav-container">
    <div class="nav-content">
      <a href="#/" class="logo">Global Taste Bridge</a>
      <div class="nav-links">
        <a href="#/" class="link">Home</a>
        <a href="#/like" class="link">My Recipes</a>
        <button @click="toggleTheme" class="link theme-btn">
          {{ currentTheme === 'dark' ? '🌙 Dark':'☀ Light' }}
        </button>
        <button @click="logout" class="link">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const currentTheme = ref(localStorage.getItem('theme') || 'light')

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)
  document.documentElement.setAttribute('data-theme', currentTheme.value)
}

onMounted(() => {
  document.documentElement.setAttribute('data-theme', currentTheme.value)
})

const logout = async () => {
  try {
    await axios.post('/api/logout')
    sessionStorage.removeItem('user')
    window.location.hash = '#/login'
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.theme-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font: inherit;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.theme-btn:hover {
  text-decoration: underline;
}

.nav-container {
  background-color: #991b1b;
  padding: 1rem;
}

.nav-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.link {
  color: white;
  text-decoration: none;
}

.link:hover {
  color: white;
}
</style>