const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');

const app = express();

// Serve static files (CSS, images, JavaScript, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/backend', express.static(path.join(__dirname, 'backend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'index.html'));
});

app.get('/allitems', verifyToken, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'allitems.html'));
});

app.get('/login', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'login.html'));
});

app.get('/signup', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'signup.html'));
});

app.get('/shopping', verifyToken, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'shopping.html'));
});

// Serve static files (CSS, images, JavaScript, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Define routes
app.get('/sell', verifyToken, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'sell.html'));
});

app.get('/shopping', verifyToken, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'shopping.html'));
});
app.post('/shopping', verifyToken, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'shopping.html'));
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.use(bodyParser.json());

let users = []; // Initialize the 'users' array

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    console.log('Received signup request with username:', username, 'and password:', password); // Debug log

    users.push({ username, password });

    console.log('Updated users array:', users); // Debug log

    fs.writeFile('backend/users.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error('Error writing to users.json:', err);
            return res.json({ success: false });
        }
        console.log('Data written to users.json');
        res.json({ success: true });
    });
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const productId = Date.now();
    cb(null, `${productId}-${file.originalname}`);
  }
});

app.get('/success', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'success.html'));
});
app.post('/success', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'success.html'));
});

app.get('/security', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'security.html'));
});

app.post('/security', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'security.html'));
});

const upload = multer({ storage: storage });

app.post('/submit', upload.single('image'), (req, res) => {
  const productId = Date.now();

  const productName = req.body.productName;
  const category = req.body.category;
  const condition = req.body.condition;
  const price = req.body.price;
  const description = req.body.description;

  const image = req.file;
  const imageUrl = image ? `/uploads/${image.filename}` : '';

  const itemData = {
    productId,
    productName,
    category,
    condition,
    price,
    description,
    imageUrl,
    sold: 0,
    totalCost: 0
  };

  const rawData = fs.readFileSync('backend/items.json');
  let items = JSON.parse(rawData);

  items.push(itemData);

  fs.writeFileSync('backend/items.json', JSON.stringify(items));

  res.redirect('/success');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// jwt security
const jwt = require('jsonwebtoken');
app.use(express.json());

const secretKey = process.env.ACCESS_TOKEN || 'your_secret_key_here'; // Set a default secret key if ACCESS_TOKEN is not defined in environment variables

// Define your authentication logic (replace with your actual logic)
function authenticateUser(username, password) {
    // Example authentication logic
    return (username === 'valid_username' && password === 'valid_password');
}

// Route for user login and generating a token
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (authenticateUser(username, password)) {
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' }); // Expires in 1 hour
        res.json({ success: true, token });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
      return res.redirect('/security'); // Redirect to security.html if no token is provided
  }

  jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
          return res.redirect('/security'); // Redirect to security.html on token verification error
      }

      req.username = decoded.username;
      next();
  });
}

// Protected route
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', username: req.username });
});
