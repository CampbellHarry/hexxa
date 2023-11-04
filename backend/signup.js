const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const USERS_DB = 'backend/user.json';

let users = JSON.parse(fs.readFileSync(USERS_DB));

function saveUsers() {
  fs.writeFileSync(USERS_DB, JSON.stringify(users, null, 2));
}

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const device = req.headers['user-agent'];

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).send('Username already exists');
  }

  users.push({
    username,
    password,
    ip,
    device,
    lastUsed: null
  });

  saveUsers();

  res.send('User registered successfully');
});



const router = express.Router();

function saveUser(userData) {
  const users = require('../users.json');
  users.push(userData);
  fs.writeFileSync('./backend/users.json', JSON.stringify(users, null, 2));
}

router.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const userId = generateUniqueId(); // Implement a function to generate a unique user ID
  const userIP = req.ip;
  const userDevice = req.headers['user-agent'];
  const signupTime = new Date().toISOString();

  const userData = {
    username,
    password,
    userId,
    userIP,
    userDevice,
    signupTime,
  };

  saveUser(userData);

  console.log('User registered successfully');
  // Redirect or respond with success message
  res.redirect('assets/html/shopping.html'); // Change to your desired success page
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const users = require('../users.json');
  const user = users.find((user) => user.username === username && user.password === password);

  if (user) {
    console.log('Login successful');
    // Redirect or respond with success message
    res.redirect('/dashboard.html'); // Change to your desired dashboard page
  } else {
    console.log('Invalid credentials');
    // Redirect or respond with error message
  }
});

module.exports = router;