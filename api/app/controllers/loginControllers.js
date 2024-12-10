const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Ensure SECRET_KEY is set
if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in the environment variables");
}

// Function to generate JWT (access or refresh token)
function generateToken(user){
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role, 
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // expires in 24 hours
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { header });
}

function generateRefreshToken(user){
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role, 
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) // refresh token expires in 30 days
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { header });
}

class LoginController {
    // Handle user login
    async submit(req, res, next) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = generateToken(user);
                const refreshToken = generateRefreshToken(user);
                return res.status(200).json({ message: 'Login successful', token, refreshToken });
            } else {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
    
    // Handle logout (optional, but good to add)
    async logout(req, res, next) {
        res.status(200).json({ message: 'Logout successful' });
    }

    async loginGoogle(req, res) {
        const { accessToken } = req.body;
      
        try {
          const ticket = await client.verifyIdToken({
            idToken: accessToken,
            audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches your Google client ID
          });
      
          const payload = ticket.getPayload();
          const { sub, name, email } = payload; // Extract data from the token payload
      
          // Check if the user already exists in your database
          let user = await User.findOne({ email });
      
          if (!user) {
            const defaultPassword = 'google_auth_user_password';
            // If the user doesn't exist, create a new one
            user = new User({
              username: name,
              email,
              password: defaultPassword
            });
            await user.save();
          }
      
          // Generate a JWT token
          const token = generateToken(user);
          generateRefreshToken(user);
          // Send the response with the token
          res.status(200).json({ message: 'Login successful', token, username: user.username });
        } catch (error) {
          console.error('Google login failed', error);
          res.status(500).json({ message: 'Failed to authenticate with Google' });
        }
    }
}

module.exports = new LoginController();
