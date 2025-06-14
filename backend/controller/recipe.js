const axios = require('axios');
const recipeModel = require('../recipe')

const searchRecipes = async (req, res) => {
  try {
    const { keyword, limit = 10 } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Keyword parameter is required'
      });
    }
    
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php`, {
      params: {
        s: keyword
      }
    });
    
    if (!response.data.meals) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'No recipes found for the given keyword',
        data: []
      });
    }
    
    const limitedRecipes = response.data.meals.slice(0, parseInt(limit));
    
    const formattedRecipes = limitedRecipes.map(recipe => ({
      id: recipe.idMeal,
      name: recipe.strMeal,
      category: recipe.strCategory,
      area: recipe.strArea,
      instructions: recipe.strInstructions,
      imageUrl: recipe.strMealThumb,
      youtubeUrl: recipe.strYoutube,
      ingredients: formatIngredients(recipe),
      source: recipe.strSource,
      tags: recipe.strTags?.split(',') || []
    }));

    const user_id = req.session.user_id;
    const likedRecipes = await recipeModel.getRecipesById(user_id);
    const likedRecipeIds = new Set(likedRecipes.map(recipe => recipe.recipe_id));

    formattedRecipes.forEach(recipe => {
      recipe.liked = likedRecipeIds.has(recipe.id);
    });
    
    res.status(200).json({
      success: true,
      count: formattedRecipes.length,
      totalMatches: response.data.meals.length,
      data: formattedRecipes
    });
    
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Format ingredients and measures from TheMealDB's dynamic fields
 * @param {Object} recipe - Raw recipe data
 * @returns {Array} - Formatted ingredients array
 */
const formatIngredients = (recipe) => {
  const ingredients = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure ? measure.trim() : ''
      });
    }
  }
  
  return ingredients;
};


const unlikeRecipe = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { recipe_id } = req.query;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    await recipeModel.unlikeRecipe(userId, recipe_id);

    res.status(200).json({
      success: true,
      message: "Recipe unliked successfully"
    });

  } catch (error) {
    console.error("Error unliking recipe:", error);
    if (error.message.includes("duplicate key")) {
      return res.status(409).json({ 
        success: false, 
        message: "Recipe already liked" 
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error while unliking recipe"
    });
  }
};

const likeRecipe = async (req, res) => {
  try {
    const userId = req.session.user.id;


    const { recipe } = req.body;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }
    if (!recipe || !recipe.id) {
      return res.status(400).json({ 
        success: false, 
        message: "Recipe data with ID is required" 
      });
    }

    const existingRecipe = await recipeModel.findRecipe(recipe.id);
    if (!existingRecipe) {
        // 
        const ingredientsStr = JSON.stringify(recipe.ingredients)


      await recipeModel.createRecipe({
        id: recipe.id,
        name: recipe.name,
        category: recipe.category,
        area: recipe.area,
        imageUrl: recipe.imageUrl,
        youtubeUrl: recipe.youtubeUrl,
        ingredients: ingredientsStr,
        source: recipe.source,
      });
    }

    await recipeModel.likeRecipe(userId, recipe.id);

    res.status(200).json({
      success: true,
      message: "Recipe liked successfully"
    });

  } catch (error) {
    console.error("Error liking recipe:", error);
    if (error.message.includes("duplicate key")) {
      return res.status(409).json({ 
        success: false, 
        message: "Recipe already liked" 
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error while liking recipe"
    });
  }
};

const fetchLikeRecipes = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const recipes = await recipeModel.getRecipesById(userId);

    console.log(recipes)

    const formattedRecipes = recipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      category: recipe.category,
      area: recipe.area,
      imageUrl: recipe.imageUrl,
      youtubeUrl: recipe.youtubeUrl,
      ingredients: JSON.parse(recipe.ingredients),
      source: recipe.source,
      like: 1
    }));


    res.status(200).json({
      success: true,
      data: formattedRecipes
    });
  } catch (error) {
    console.error("Error fetching liked recipes:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching liked recipes"
    });
  }
};

module.exports = {
  searchRecipes,
  likeRecipe,
  unlikeRecipe,
  fetchLikeRecipes
};