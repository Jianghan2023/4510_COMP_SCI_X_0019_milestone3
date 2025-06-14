<template>
  <div class="recipe-card">
    <img :src="recipe.imageUrl" :alt="recipe.name" class="card-image">
    
    <div class="card-content">
      <h3 class="card-title">{{ recipe.name }}</h3>
      <div class="meta-info">
        <span class="category">{{ recipe.category }}</span>
        <span class="divider">/</span>
        <span class="cuisine">{{ recipe.area }} Cuisine</span>
      </div>

      <div class="cook-time" v-if="cookTimes">
        <span v-for="(time, key) in cookTimes" :key="key" class="time-item">
          {{ key }}: {{ time }}
        </span>
      </div>

      <div class="ingredients">
        <p class="section-title">Main Ingredients:</p>
        <ul class="ingredients-list">
          <li v-for="(ingredient, index) in recipe.ingredients.slice(0, 3)" :key="index">
            {{ ingredient.name }} - {{ ingredient.measure }}
          </li>
          <li v-if="recipe.ingredients.length > 3" class="more-ingredients">+{{ recipe.ingredients.length - 3 }} more</li>
        </ul>
      </div>

      <div class="card-actions">
        <button @click="handleLike" :class="['btn', 'btn-like', {'btn-liked': isLiked}]">
          <i class="icon">{{ isLiked ? '❤️' : '♡' }}</i>
          <span>{{ isLiked ? 'Liked' : 'Like' }}</span>
        </button>
        <a :href="recipe.youtubeUrl" target="_blank" class="btn btn-video">
          <i class="icon">▶</i> Watch Video
        </a>
        <a :href="recipe.source" target="_blank" class="btn btn-recipe">
          View Full Recipe
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue' 
import axios from 'axios';
const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const isLiked = ref(props.recipe.like === 1 || false)
const handleLike = async () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    const recipeData = {
      id: props.recipe.id,
      name: props.recipe.name,
      category: props.recipe.category,
      area: props.recipe.area,
      imageUrl: props.recipe.imageUrl,
      youtubeUrl: props.recipe.youtubeUrl,
      ingredients: props.recipe.ingredients,
    }
    await axios.post(`/api/like`, {
      recipe: recipeData
    })
  } else {
    await axios.delete(`/api/like?recipe_id=${props.recipe.id}`)
  }
}

const cookTimes = (() => {
  const timeRegex = /(Prep|Cook|Ready in):(\d+min)/g
  const matches = {}
  let match
  while ((match = timeRegex.exec(props.recipe.instructions)) !== null) {
    matches[match[1]] = match[2]
  }
  return Object.keys(matches).length ? matches : null
})()
</script>

<style scoped>
.recipe-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-width: 320px;
  transition: transform 0.2s ease;
}

.recipe-card:hover {
  transform: translateY(-4px);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  color: #2d3748;
  line-height: 1.3;
}

.meta-info {
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.divider {
  margin: 0 0.5rem;
  color: #e2e8f0;
}

.cook-time {
  display: flex;
  gap: 1rem;
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
}

.ingredients {
  margin: 1rem 0;
}

.section-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
  color: #2d3748;
}

.ingredients-list li {
  margin-bottom: 0.25rem;
  padding-left: 1.2em;
  position: relative;
}

.ingredients-list li::before {
  content: "•";
  color: #dc2626;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  position: absolute;
  left: 0;
}

.more-ingredients {
  color: #718096;
  font-size: 0.875rem;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn {
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-video {
  background-color: #dc2626;
  color: white;
}

.btn-video:hover {
  background-color: #b91c1c;
}

.btn-recipe {
  background-color: #edf2f7;
  color: #2d3748;
}

.btn-recipe:hover {
  background-color: #e2e8f0;
}

.icon {
  font-size: 1rem;
}

.btn-like {
  background-color: #fecdd3;
  color: #9f1239;
  min-width: 80px;
}

.btn-like:hover {
  background-color: #fda4af;
}

.btn-like.btn-liked {
  background-color: #f43f5e;
  color: white;
}
</style>
