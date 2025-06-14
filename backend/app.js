const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const session = require('express-session');
var sqlite = require("better-sqlite3");
var SqliteStore = require("better-sqlite3-session-store")(session)
var sessionsDB = new sqlite("sessions.db");
const {
  searchRecipes,
  likeRecipe,
  unlikeRecipe,
  fetchLikeRecipes
} = require('./controller/recipe')
const { register, login, logout, isLogin } = require('./controller/account')
const router = express.Router()

// ============ express-session ===========
// I referrenced the code from 
// https://expressjs.com/en/resources/middleware/session.html
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  store: new SqliteStore({
    client: sessionsDB,
  }),
  secret: 'k45rio212333kljwoiemdslkd',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400000,
  },
}));
// ============ express-session ===========


// ============ all apis ===========
router.post('/register', register)
router.post('/login', login)
router.post('/logout', isLogin, logout)
router.get('/search', isLogin, searchRecipes)
router.post('/like', isLogin, likeRecipe)
router.delete('/like', isLogin, unlikeRecipe)
router.get('/like', isLogin, fetchLikeRecipes)
app.use('/api', router);
// ============ all apis ===========




app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
    