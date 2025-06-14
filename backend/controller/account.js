const axios = require('axios');
const bcrypt = require('bcryptjs');
const Auth = require('../auth');


const login = (req, res) => {
  const { email, password } = req.body

  Auth.findUser(email, (err, user) => {
    if (err) return res.status(500).json({ message: 'Failed' })
    if (!user) return res.status(401).json({ message: 'Password Error.' })

    bcrypt.compare(password, user.password, (err, checkSuccess) => {
      if (err) return res.status(500).json({ message: 'Failed' })
      if (checkSuccess) {
          req.session.user = { 
            id: user.id, 
            email: user.email
        }
    
        const userData = {
            id: user.id,
            email: user.email
        }

        res.json({ message: 'Login successful', user: userData })

      } else {
        return res.status(401).json({ message: 'Password Error.' })
      }

    })
  })
}

const register = (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  Auth.findUser(email, (err, user) => {
    console.log(user)

    if (user) {
        return res.status(409).json({ message: 'Email already exists' })

    } else {
        console.log('register'+ email + password)

        Auth.createUser({ email, password }, (err, userId) => {
          if (err) {
            return res.status(500).json({ message: 'Failed', data: err })
          }
          res.status(201).json({ message: 'Success' })
        })
    }
  })
}

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
        return res.status(500).json({ message: 'Failed' })

    } else {
        res.clearCookie('connect.sid')
        res.json({ message: 'Success' })
    }
  })
}

const isLogin = (req, res, next) => {
  if (req.session.user) { next() } else { res.status(401).json({ message: 'Not login' }) }
}


module.exports = {
    register,
    login,
    logout,
    isLogin
};