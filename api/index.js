
require('dotenv').config(); 
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const db = require('./config/db');
//const session = require('express-session');
const methodOverride = require('method-override');
const route = require('./routes');
const cors = require('cors');


app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cấu hình session với cookie
// app.use(session({
//   secret: 'your-secret-key',
//   resave: true, 
//   saveUninitialized: false,
//   cookie: {
//       secure: false,
//       httpOnly: true, // Bảo vệ cookie khỏi truy cập của client-side JavaScript
//       maxAge: 24 * 60 * 60 * 1000 
//   }
// }));


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(express.static(path.join(__dirname, 'public')));


route(app); 

db.connect();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
