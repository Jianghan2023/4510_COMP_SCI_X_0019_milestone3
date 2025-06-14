<template>
  <div>
    <NavBar />
    <div class="content-container">
      <h1 class="title">My Favorite Recipe Center</h1>
      <span class="subtitle">Manage my own recipes here.</span>

      <h2>All my likes!</h2>

      <div class="recipe-grid">
        <RecipeCard
          v-for="recipe in likeRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import axios from 'axios'
import NavBar from './NavBar.vue'
import RecipeCard from '@/components/RecipeCard.vue'


const likeRecipes = ref([]);

const fetchRandomRecipes = async () => {
    const response = await axios.get(`/api/like`);
    likeRecipes.value = response.data?.data || []
    console.log(response.data)
}

onMounted(() => {
    fetchRandomRecipes();
})


</script>

<style scoped>
.content-container {
  padding: 2rem 10rem;
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

.button-group {
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
}

.btn {
  background-color: #6b7280;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn:hover {
  background-color: #4b5563;
}

.recipe-grid {
  display: flex;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .recipe-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.search-group {
  margin: 1rem 0;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
  outline: none;
}

.search-input:focus {
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107,114,128,0.1);
}
</style>