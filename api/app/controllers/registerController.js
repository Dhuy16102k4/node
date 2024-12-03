const User = require('../models/users');
const bcrypt = require('bcrypt')
class RegisterController {
    async submit(req, res, next) {
        const { username, email, password, confirm_password } = req.body;
        if (!username || !email || !password || !confirm_password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (password !== confirm_password) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must contain at least 6 characters' });
        }
        User.findOne({ $or: [{ username }, { email }] })
            .then(existsUser => {
                if (existsUser) {
                    return res.status(409).json({ error: 'Username or email already exists' });
                } const newUser = new User({ username, email, password });

                return newUser.save();
            })
            .then(() => {
                res.status(201).json({ message: 'User registered successfully' });
            })
            .catch(error => {
                console.error('Error during registration:', error);
                next(error);
            });
        }
    }

module.exports = new RegisterController();
