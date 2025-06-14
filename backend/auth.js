const bcrypt = require('bcryptjs')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('SQLite connection error:', err.message);
  }
});


const addBook = (book, callback) => {
  const query = 'INSERT INTO books (id, title, subtitle, authors, image, url) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(query, [book.id, book.title, book.subtitle, book.authors, book.image, book.url], function(err) {
    if (err) {
      console.error('Error adding book:', err.message);
      callback(err, null);
    } else {
      callback(null, this.lastID);
    }
  });
}

const getBook = (id, callback) => {
  const query = 'SELECT * FROM books WHERE id = ?';
  db.get(query, [id], function(err, row) {
    if (err) {
      console.error('Error fetching book:', err.message);
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
}

const getAllBooks = (userId, callback) => {
  const query = 'SELECT books.*, user_book.* FROM books JOIN user_book ON books.id = user_book.book_id WHERE user_book.user_id = ?';
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('Error fetching books:', err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

const collectBook = (bookId, userId, collectAt, wantReadingAt, readingAt, readAt, callback) => {
  // if not exists, insert
  // if exists, update
    const query = 'INSERT OR REPLACE INTO user_book (book_id, user_id, collect_at, want_reading_at, reading_at, read_at) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(query, [bookId, userId, collectAt, wantReadingAt, readingAt, readAt], function(err) {
    if (err) {
      console.error('Error collecting book:', err.message);
      callback(err, null);
    } else {
      callback(null, this.lastID);
    }
  });
}

const findUser = (email, callback) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], callback)
}

const createUser = (user, callback) => {
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return callback(err)
    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)', [user.email, hash],
      { lastID: true },
      function (err) {
        if (err) return callback(err)
        callback(null, this.lastID)
      }
    )
  })
}



module.exports = {
  createUser,
  findUser,
  getBook,
  addBook,
  getAllBooks,
  collectBook
}
