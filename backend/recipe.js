const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('SQLite connection error:', err.message);
  }
});

const findRecipe = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM recipes WHERE id = ?', id, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

const createRecipe = (recipe) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO recipes (id, name, category, area, youtubeUrl, imageUrl, source, ingredients) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [recipe.id, recipe.name, recipe.category, recipe.area, recipe.youtubeUrl, recipe.imageUrl, recipe.source, recipe.ingredients],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
  });
}

const likeRecipe = (user_id, recipe_id) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT OR IGNORE INTO user_like (user_id, recipe_id) VALUES (?, ?)',
      [user_id, recipe_id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
  });
}

const unlikeRecipe = (user_id, recipe_id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM user_like WHERE user_id = ? AND recipe_id = ?',
      [user_id, recipe_id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
  });
}

const getRecipesById = (user_id) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT recipes.* FROM recipes JOIN user_like ON recipes.id = user_like.recipe_id WHERE user_like.user_id = ?',
      [user_id],
      function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
  });
}


module.exports = {
  findRecipe,
  createRecipe,
  likeRecipe,
  unlikeRecipe,
  getRecipesById
}