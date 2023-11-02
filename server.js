const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
