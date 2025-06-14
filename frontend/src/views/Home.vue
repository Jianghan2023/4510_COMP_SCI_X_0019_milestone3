<template>
  <div>
    <NavBar />
    <div class="content-container">
      <h1 class="title">Just find what you want to eat!</h1>
      <span class="subtitle">You can find recipes from different cuisines and ingredients.</span>
      <div class="search-group">
        <input
          type="text"
          class="search-input"
          v-model="searchKeyword"
          placeholder="Input keyword ..."
        >
      </div>
      <div class="button-group">
        <button @click="handleSearch" class="btn">Search</button>
      </div>

      <h2 v-if="searchKeyword.value != ''">Search Result</h2>
      <div v-if="searchRecipes.length > 0" class="recipe-grid">
        <RecipeCard
          v-for="recipe in searchRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <h2>Today's random recipes!</h2>

      <div class="recipe-grid">
        <RecipeCard
          v-for="recipe in randomRecipes"
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
const foodSubjects = [
    "Pork","Breakfast","Chicken","Vegetarian","Fish","Bread","Snacks"
]

const randomRecipes = ref([]);
const searchRecipes = ref([]);
const searchKeyword = ref('')

const handleSearch = async () => {
  if (searchKeyword.value.trim()) {
    try {
      const response = await axios.get(`/api/search?keyword=${encodeURIComponent(searchKeyword.value.trim())}&limits=20`)
      searchRecipes.value = response.data?.data || []
    } catch (err) {
      console.error('Search failed:', err)
    }
  }
}




const fetchRandomRecipes = async () => {
    // pick 1 subject
    const subject = foodSubjects[Math.floor(Math.random() * foodSubjects.length)];
    // search for 10 recipes
    const response = await axios.get(`/api/search?keyword=${subject}&limits=10`);
    randomRecipes.value = response.data?.data || []
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