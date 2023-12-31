const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();


const app = express();

const rateLimit = require('express-rate-limit');


// set up rate limiter: maximum of five requests per minute

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // max 100 requests per windowMs
});

app.use(limiter);

// Serve static files (CSS, images, JavaScript, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/backend', express.static(path.join(__dirname, 'backend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'index.html'));
});



app.get('/login', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'login.html'));
});

app.get('/signup', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'signup.html'));
});


// Serve static files (CSS, images, JavaScript, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Define routes


app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.use(bodyParser.json());

app.post('/signup', (req, res) => {
  const { username, name, password, approved } = req.body;
  const role = 'user';
  const dateJoined = new Date().toLocaleDateString();
  const aboutMe = 'This user has not set an about me yet.';
  const totalOrders = 0;
  const currentBadge = null;
  const location = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const passwordhashed = bcrypt.hashSync(password, 10);


  fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users.json:', err);
      return res.json({ success: false });
    }

    let users = JSON.parse(data);
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.json({ success: false, message: 'User already exists' });
    }

    users.push({ username, name, passwordhashed, approved, role, dateJoined, location, aboutMe, totalOrders, currentBadge, earlyuser: true});

    fs.writeFile('./users.json', JSON.stringify(users), (err) => {
      if (err) {
        console.error('Error writing to users.json:', err);
        return res.json({ success: false });
      }
      console.log('Data written to users.json');
      res.redirect('/shopping');
    });
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

app.get('/login', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'login.html'));
});


app.post('/verify-session', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'verify-session.html'));
});

app.get('/verify-session', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'verify-session.html'));
});

app.get('/security', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'security.html'));
});

app.post('/security', (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'security.html'));
});

app.use(bodyParser.urlencoded({ extended: true }));

const bcrypt = require('bcrypt');

const session = require('express-session');


// Load user data from users.json
const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key', // Change this to a secure random string
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(user => user.username === username && bcrypt.compareSync(password, user.passwordhashed));
  
  if (user) {
    const sessionToken = generateSessionToken();
    user.sessionToken = sessionToken;

    res.cookie('session_token', sessionToken);
    req.session.user = user.username; // Set the session variable

    // Check user role and redirect accordingly
    if (user.role === 'owner' || user.role === 'developer' || user.role === 'moderator' || user.role === 'support') {
      res.redirect('/moderation');
    } else if (user.role === 'user') {
      res.redirect('/shopping');
    } else {
      // Handle other roles or unexpected cases
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});
const cookieParser = require('cookie-parser');


const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

// Apply the middleware to routes needing protection
app.use('/items.json', checkApiKey);
app.use('/users.json', checkApiKey);
app.use('/basket.json', checkApiKey);
app.use('/notifs.json', checkApiKey);

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Protect sensitive routes middleware
const protectSensitiveRoutes = (req, res, next) => {
  if (req.session && req.session.user) {
    // Check if the user making the request matches the authenticated user
    if (req.params.userId && req.params.userId !== req.session.user.id) {
      // Unauthorized access, send an unauthorized response
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    // Only send necessary information to the client
    const user = {
      id: req.session.user.id,
      username: req.session.user.username,
    };

    res.locals.user = user; // Make user data available to other middleware/routes
    next();
  } else if (req.method === 'POST') {
    // Allow POST requests to go
    next();
  } else {
    // User is not authenticated or lacks the necessary permissions, send an unauthorized response
    res.redirect('/security');
  }
};

// Apply the middleware to routes needing protection
app.use('/items.json', protectSensitiveRoutes);
app.use('/users.json', protectSensitiveRoutes);
app.use('/basket.json', protectSensitiveRoutes);
app.use('/notifs.json', protectSensitiveRoutes);


// Sample route
app.get('/security', (req, res) => {
  res.send('Security Page');
});


// Example route accessible only to users with the 'admin' role
app.get('/users.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'users.json'));
});

app.get('/notifs.json',protectSensitiveRoutes, (req, res) => 
  res.sendFile(path.join(__dirname, 'notifs.json')));
app.get('/items.json',protectSensitiveRoutes, (req, res) => 
  res.sendFile(path.join(__dirname, 'items.json')));
app.get('/basket.json', (req, res) => 
  res.sendFile(path.join(__dirname, 'basket.json')));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Load users from JSON file

// Example route accessible only to users with the 'admin' role
app.get('/users.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'users.json'));
});
// Handle POST request to log denial
app.post('/logDenial', (req, res) => {
  const { productId, productName, seller, status, reason } = req.body;

  // Load existing notifications from the file
  const existingNotifs = fs.readFileSync('notifs.json', 'utf8');
  const notifs = existingNotifs ? JSON.parse(existingNotifs) : [];

  // Add the new denial information to the notifications array
  notifs.unshift({
    productId,
    productName,
    seller,
    status,
    reason,
    timestamp: new Date().toLocaleString(),
  });

  // Write the updated notifications array back to the file
  fs.writeFileSync('notifs.json', JSON.stringify(notifs, null, 2), 'utf8');

  res.sendStatus(200);
});
// Handle POST request to log denial
app.post('/logAccept', (req, res) => {
  const { productId, productName, seller, status} = req.body;

  // Load existing notifications from the file
  const existingNotifs = fs.readFileSync('notifs.json', 'utf8');
  const notifs = existingNotifs ? JSON.parse(existingNotifs) : [];

  // Add the new denial information to the notifications array
  notifs.unshift({
    productId,
    productName,
    seller,
    status,
    timestamp: new Date().toLocaleString(),
  });

  // Write the updated notifications array back to the file
  fs.writeFileSync('notifs.json', JSON.stringify(notifs, null, 2), 'utf8');

  res.sendStatus(200);
});
app.post('/logTicket', (req, res) => {
  const { ticketId, username, subject, message, status } = req.body;

  const existingNotifs = fs.readFileSync('notifs.json', 'utf8');
  const notifs = existingNotifs ? JSON.parse(existingNotifs) : [];

  notifs.unshift({
    ticketId,
    username,
    subject,
    message,
    status,
    timestamp: new Date().toLocaleString(),
  });

  fs.writeFileSync('notifs.json', JSON.stringify(notifs, null, 2), 'utf8');

  res.sendStatus(200);
});


app.post('/items.json',protectSensitiveRoutes, (req, res) => {
  const items = req.body;
  fs.writeFile('items.json', JSON.stringify(items), err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing to file');
    }

    res.send('File updated successfully');
  });
});

app.get('/basket.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'basket.json'));
});



// Middleware
app.use(express.json());
app.use(cookieParser());

// Load users from JSON file
let users1 = JSON.parse(fs.readFileSync('./users.json'));

// Function to save users to JSON file
function saveUsers() {
  fs.writeFileSync('./users.json', JSON.stringify(users1));
}

// Function to generate session token
function generateSessionToken() {
  return Math.random().toString(36).substr(2, 9);
}

// Endpoint to handle login

// Endpoint to verify session token
app.post('/verify-session', (req, res) => {
  const { sessionToken } = req.body;

  const user = users1.find(u => u.sessionToken === sessionToken);

  if (user) {
    res.json({ loggedIn: true, username: user.username });
  } else {
    res.json({ loggedIn: false });
  }
});



// Serve static files (HTML, CSS, etc.)
app.use(express.static('public'));

const items = require('./items.json');

app.get('/product/:id', (req, res) => {
  const id = parseInt(req.params.id); // Parse the id as a number
  if (isNaN(id)) {
    return res.status(400).send('Invalid ID');
  }

  const product = items.find(item => item.productId === id);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  res.send(renderProductPage(product));
});

const DOMPurify = require('dompurify');


function renderProductPage(product) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hexxa</title>
      <link rel="icon" href="/assets/images/favicon.png">
      <link rel="stylesheet" href="/assets/css/header.css">
      <link rel="stylesheet" href="/assets/css/footer.css">
      <link rel="stylesheet" href="/assets/css/items.css">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.4/purify.min.js"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  
  </head>
  <body>
  <header class="issues">
  <div class="issuee">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
  $(document).ready(function() {
      $('.issuee').load('/assets/html/header.html');
  });
</script>
</div>
</header>
<header class="tophead">
<div class="search-container">
  <div class="search-box">
      <input type="text" placeholder="Search for products, brands and more with Hexxa">
      <button>Search</button>
  </div>
</div>
<div class="containe">
  <div class="login">
      <a class="text" href="" id="link"><span id="username"></span></a>
  </div>
  <p style="color: white; font-size: 1.2rem;">|</p>
  <div class="notifs">
      <a href="/notifications" class="text">Notifications</a>
  </div>
      <img src="/assets/images/notifs.png" height="55px" alt="Basket" class="basket">
  <p style="color: white; font-size: 1.2rem;">|</p>
  <div class="basket">
      <a href="/basket" class="text"><img src="/assets/images/shoppingb.png" height="100px" alt="Basket" class="basket"></a>
  </div>
</div>
</header>
<header>
  <img src="/assets/images/favicon.png" alt="Hexxa Logo" height="100px">
  <nav>
      <ul>
              <li class="box buyhover"><p class="text buyhover">Buy Items</p>
                  <ul class="buyitems">
                      <li><a href="/allitems" class="text buyhover">Browse Items</a></li>
                      <li><a href="/shopping" class="text buyhover">Store front</a></li>
                  </ul>
              </li>
              <li class="box buyhover"><p class="text buyhover">Manage Items</p>
                  <ul class="buyitems">
                      <li><a href="/sell" class="text buyhover">Sell with Hexxa</a></li>
                      <li><a href="/dashboard" class="text buyhover">Manage your Items</a></li>
                  </ul>
              </li>
              <li class="box buyhover"><p class="text buyhover" href="">Help</p>
                  <ul class="buyitems">
                      <li><a href="/faq" class="text buyhover">FAQs</a></li>
                      <li><a href="/support" class="text buyhover">Support</a></li>
                  </ul>
              </li>
                  <li class="box buyhover"><p class="text buyhover">Account</p>
                      <ul class="buyitems">
                      <li><a href="" class="text buyhover">Account Settings</a></li>
                      <li><a href="" class="text buyhover">Orders</a></li>
                      <li><a href="" class="text buyhover">Saved Items</a></li>
                      <li><a href="" class="text buyhover">Sign Out</a></li>
                  </ul>
      </ul>
  </nav>
</header>
      <main>
          <section class="product-image-container">
              <img src="/assets/images/hexxa.png" alt="Product Image">
          </section>
          <section class="product-info-container">
            <div class="item">
              <h2 id="name">${product.productName}</h2>
              <div id="reviews">Reviews: ${product.reviews}</div>
              <div id="seller">Seller: ${product.seller}</div>
              <hr>
              <p id="price1">£${product.price}</p>
              <hr>
              <p id="description">${product.description}</p>
            </div>
          </section>
          <section class="buy-container">
            <div class="buysection">
              <div class="flag">
                <img src="/assets/images/flagitem.png" width="30px" onmouseover="src='/assets/images/hoverflag.png'" onmouseout="this.src='/assets/images/flagitem.png'">
                <br>
              </div>
              <div id="approved" style="border: ${product.approved ? 'border: 1px solid #005700;' : '2px solid red'}" onclick="popdown()">
                  THIS SELLER IS <span>${product.approved ? 'APPROVED' : 'NOT APPROVED'}</span>
              </div>
                  ${product.approved ? `
                  <div id="moreinfo">
                      <img src="/assets/images/authorised.png" width="50px"><h2>Verified Seller</h2><p>Approved sellers are sellers that have been approved by Hexxa. This means that they have been verified and are trusted sellers.</p>
                  </div>
                  ` : ''}
              <div id="role" style="border: ${product.sellerrole === 'owner' ? 'border: 1px solid #FFD700; color: #FFD700;' : product.sellerrole === 'developer' ? 'border: 1px solid #800080; color: #800080;' : product.sellerrole === 'moderator' ? 'border: 1px solid #008000; color: #008000;' : product.sellerrole === 'support' ? 'border: 1px solid #87CEEB; color: #87CEEB;' : product.sellerrole === 'user' ? 'border: 1px solid #008080; color: ;008080;' : '2px solid #008080; color: ;008080;'}">
                  THIS SELLER IS <span>${product.sellerrole === 'owner' ? 'AN OWNER' : product.sellerrole === 'developer' ? 'A DEVELOPER' : product.sellerrole === 'moderator' ? 'A MODERATOR' : product.sellerrole === 'support' ? 'A SUPPORT AGENT' : product.sellerrole === 'user' ? 'A USER' : 'USER'}</span>
              </div>                 
              <hr>
              <div id="price">Price: £${product.price}</div>
              <div id="delivery">Delivery: ${product.delivery}</div>
              <hr>
              <div id="instock">${product.inStock ? 'In stock' : 'Out of stock'}</div>
              <hr>
              <button class="add-to-basket" data-product-id="${product.productId}">Add to Basket</button>
              <button id="buynow">Buy Now</button>
            </div>
          </section>
          </main>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <section id="reviewsac">
              <h2>Reviews</h2>
              <form>
                  <label for="review">Write a review:</label>
                  <textarea id="review" name="review" rows="4" cols="50" maxlength="300"></textarea>
                  <label for="rating">Rating:</label>
                  <select id="rating" name="rating">
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                  </select>
                  <input type="submit" value="Submit">
              </form>
              <div class="reviews-container">
                  <div class="review">
                      <h3>TEST</h3>
                      <p>TEST</p>
                      <p class="reviewer">- Thor</p>
                      <div class="stars">
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star"></span>
                      </div>
                  </div>
                  <div class="review">
                      <h3>TEST</h3>
                      <p>TEST</p>
                      <p class="reviewer">- Harry Campbell</p>
                      <div class="stars">
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star"></span>
                          <span class="fa fa-star"></span>
                          <span class="fa fa-star"></span>
                          <span class="fa fa-star"></span>
                      </div>
                  </div>
              </div>
          </section>
          <section id="qna">
              <h2>Q&A</h2>
              <div class="qna-container">
                  <div class="question">
                      <h3>What is the warranty on this product?</h3>
                      <p>The warranty on this product is one year.</p>
                  </div>
                  <div class="question">
                      <h3>Does this product come with a user manual?</h3>
                      <p>Yes, this product comes with a user manual.</p>
                  </div>
              </div>
          </section>
      </main>
      <footer>
          <div class="footer-container">
              <div class="footer-section">
                  <h3>About Hexxa</h3>
                  <p>Hexxa is an online marketplace that offers a wide range of products from electronics to clothing. We have a wide range of brands to choose from and we are committed to providing our customers with the best shopping experience possible.</p>
              </div>
              <div class="footer-section">
                  <h3>Customer Service</h3>
                  <ul>
                      <li><a href="#">Contact Us</a></li>
                      <li><a href="#">FAQs</a></li>
                      <li><a href="#">Returns &amp; Refunds</a></li>
                      <li><a href="#">Shipping &amp; Delivery</a></li>
                  </ul>
              </div>
              <div class="footer-section">
                  <h3>Connect with Us</h3>
                  <ul>
                      <li><a href="#">Facebook</a></li>
                      <li><a href="#">Twitter</a></li>
                      <li><a href="#">Instagram</a></li>
                      <li><a href="#">Linkedin</a></li>
                  </ul>
              </div>
          </div>
          <div class="footer-bottom">
              <p>&copy; 2023 Hexxa. All Rights Reserved.</p><p>Terms &amp; Conditions | Privacy Policy</p><p>Hexxa is apart of the hdev group</p>
              </p>
          </div>
      </footer>
    <script src="/backend/basca.js"></script>
    <script src="/backend/header.js"></script>
  <script>
  const popdown = () => {
      var popup = document.getElementById("moreinfo");
      if (popup.style.display === "none") {
          popup.style.display = "block";
      } else {
          popup.style.display = "none";
      }
  }
  </script>
  </body>
  </html>
  `;
}

// Function to read items.json file
function readItemsFile() {
  const filePath = path.join(__dirname, 'items.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}
// Function to check if items.json file has changed
function hasItemsFileChanged(lastModifiedTime) {
  const filePath = path.join(__dirname, 'items.json');
  const stats = fs.statSync(filePath);
  return stats.mtimeMs > lastModifiedTime;
}

// Endpoint to handle product page
app.get('/product/:id', (req, res) => {
  const id = parseInt(req.params.id); // Parse the id as a number
  if (isNaN(id)) {
    return res.status(400).send('Invalid ID');
  }

  let items = readItemsFile();
  let lastModifiedTime = Date.now();

  const product = items.find(item => item.productId === id);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  res.send(renderProductPage(product));

  // Poll items.json file every 5 seconds and update product page if data has changed
  setInterval(() => {
    if (hasItemsFileChanged(lastModifiedTime)) {
      items = readItemsFile();
      lastModifiedTime = Date.now();
      const updatedProduct = items.find(item => item.productId === id);
      if (updatedProduct) {
        res.send(renderProductPage(updatedProduct));
      }
    }
  }, 5000);
});
const requireAuth = (req, res, next) => {
  const sessionToken = req.cookies.session_token;

  if (!sessionToken) {
    return res.redirect('/login'); // Redirect to login page if session token is not present
  }

  // Check if the session token is valid (e.g., compare it with the tokens stored in your users array)
  const user = users.find(user => user.sessionToken === sessionToken);

  if (!user) {
    return res.redirect('/login'); // Redirect to login page if session token is invalid
  }

  req.user = user; // Attach the user object to the request for later use in the route handler
  next(); // Continue with the next middleware or route handler
};

app.get('/notifications',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'notifications.html'));
});
app.post('/notifications',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'notifications.html'));
});
app.post('/success',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'success.html'));
});
app.get('/moderation',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'moderation.html'));
});
app.get('/success',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'success.html'));
});
app.get('/sell',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'sell.html'));
});

app.get('/shopping',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'shopping.html'));
});
app.post('/shopping',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'shopping.html'));
});
app.get('/support',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'support.html'));
});

app.get('/allitems',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'allitems.html'));
});

app.post('/allitems',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'allitems.html'));
});


app.get('/getUsername', (req, res) => {
  const username = req.session.user;
  res.send({ username });
});

const upload = multer({ storage: storage });

app.post('/submit', upload.single('image'), (req, res) => {
  const productId = Date.now();

  const productName = req.body.productName;
  const category = req.body.category;
  const condition = req.body.condition;
  const price = req.body.price;
  const description = req.body.description;
  const delivery = req.body.delivery;
  const reviews = req.body.reviews;
  const seller = req.session.user;
  const image = req.file;
  const inStock = true;
  const modapproval = false;
  const imageUrl = image ? `/uploads/${image.filename}` : '';

  // Read sellers data from file
  const sellerData = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

  // Find the seller in the data
  const sellerInfo = sellerData.find(sellerInfo => sellerInfo.username === seller);
  const sellerrole = sellerInfo.role;

  // Determine if the seller is approved
  let approved = false;
  if (sellerInfo && sellerInfo.approved) {
    approved = true;
  }

  const itemData = {
    productId,
    productName,
    seller,
    category,
    condition,
    price,
    inStock,
    description,
    imageUrl,
    reviews,
    delivery,
    approved,
    sellerrole,
    sold: 0,
    totalCost: 0,
    modapproval: false
  };

  const rawData = fs.readFileSync('./items.json');
  let items = JSON.parse(rawData);

  items.push(itemData);

  fs.writeFileSync('./items.json', JSON.stringify(items));

  res.redirect('/success');
});

const userss = require('./users.json');
const { availableParallelism } = require('os');

app.get('/user/:username', (req, res) => {
  const username = req.params.username; // Get the username from the route parameter

  const user = userss.find(item => item.username === username);

  if (!user) {
    return res.status(404).send('User not found');
  }

  res.send(renderUserPage(user));
});




fs.readFile('users.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const users = JSON.parse(data);

  for (const user of users) {
    if (user.totalOrders) {
      const totalOrders = user.totalOrders;
      const badgeNumber = Math.floor((totalOrders - 1) / 5) * 5 + 5;
      user.currentBadge = badgeNumber;
    }
  }

  // Save the updated data back to the file
  fs.writeFile('users.json', JSON.stringify(users), 'utf8', (err) => {
    if (err) {
      console.error('Error writing the file:', err);
    } else {
      console.log('Badge numbers updated successfully!');
    }
  });
});

function getUserData(username) {
  const usersData = fs.readFileSync('users.json');
  const users = JSON.parse(usersData);
  return users.find(user => user.username === username);
}

function renderUserPage(username) {
  const user = getUserData(username);

  if (!user) {
    return 'User not found';
  }


  let updatedBadgeNumber;
  if (totalOrders >= 25) {
    updatedBadgeNumber = 25;
  } else if (totalOrders >= 20) {
    updatedBadgeNumber = 20;
  } else if (totalOrders >= 15) {
    updatedBadgeNumber = 15;
  } else if (totalOrders >= 10) {
    updatedBadgeNumber = 10;
  } else {
    updatedBadgeNumber = 5;
  }
}

function renderUserPage(user) {
  const { username, aboutMe, dateJoined,location, approved, role, badgeNumber, totalOrders, earlyuser} = user;

  let updatedBadgeNumber;
  if (totalOrders >= 30) {
    updatedBadgeNumber = 30;
  } else if (totalOrders >= 25) {
    updatedBadgeNumber = 25;
  } else if (totalOrders >= 20) {
    updatedBadgeNumber = 20;
  } else if (totalOrders >= 15) {
    updatedBadgeNumber = 15;
  } else if (totalOrders >= 10) {
    updatedBadgeNumber = 10;
  } else if (totalOrders >= 5) {
    updatedBadgeNumber = 5;
  }
  else{
    updatedBadgeNumber = 0;
  }
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hexxa</title>
      <link rel="icon" href="/assets/images/favicon.png">
      <link rel="stylesheet" href="/assets/css/header.css">
      <link rel="stylesheet" href="/assets/css/footer.css">
      <link rel="stylesheet" href="/assets/css/user.css">
      <link rel="preconnect" href="https://fonts.gstatic.com">
      <link href="https://fonts.googleapis.com/css2?family=Jost&display=swap" rel="stylesheet">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.4/purify.min.js"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <body>
  <header class="issues">
  <div class="issuee">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
  $(document).ready(function() {
      $('.issuee').load('/assets/html/header.html');
  });
</script>
</div>
</header>
<header class="tophead">
<div class="search-container">
  <div class="search-box">
      <input type="text" placeholder="Search for products, brands and more with Hexxa">
      <button>Search</button>
  </div>
</div>
<div class="containe">
  <div class="login">
      <a class="text" href="" id="link"><span id="username"></span></a>
  </div>
  <p style="color: white; font-size: 1.2rem;">|</p>
  <div class="notifs">
      <a href="/notifications" class="text">Notifications</a>
  </div>
      <img src="/assets/images/notifs.png" height="55px" alt="Basket" class="basket">
  <p style="color: white; font-size: 1.2rem;">|</p>
  <div class="basket">
      <a href="/basket" class="text"><img src="/assets/images/shoppingb.png" height="100px" alt="Basket" class="basket"></a>
  </div>
</div>
</header>
<header>
  <img src="/assets/images/favicon.png" alt="Hexxa Logo" height="100px">
  <nav>
      <ul>
              <li class="box buyhover"><p class="text buyhover">Buy Items</p>
                  <ul class="buyitems">
                      <li><a href="/allitems" class="text buyhover">Browse Items</a></li>
                      <li><a href="/shopping" class="text buyhover">Store front</a></li>
                  </ul>
              </li>
              <li class="box buyhover"><p class="text buyhover">Manage Items</p>
                  <ul class="buyitems">
                      <li><a href="/sell" class="text buyhover">Sell with Hexxa</a></li>
                      <li><a href="/dashboard" class="text buyhover">Manage your Items</a></li>
                  </ul>
              </li>
              <li class="box buyhover"><p class="text buyhover" href="">Help</p>
                  <ul class="buyitems">
                      <li><a href="/faq" class="text buyhover">FAQs</a></li>
                      <li><a href="/support" class="text buyhover">Support</a></li>
                  </ul>
              </li>
                  <li class="box buyhover"><p class="text buyhover">Account</p>
                      <ul class="buyitems">
                      <li><a href="" class="text buyhover">Account Settings</a></li>
                      <li><a href="" class="text buyhover">Orders</a></li>
                      <li><a href="" class="text buyhover">Saved Items</a></li>
                      <li><a href="" class="text buyhover">Sign Out</a></li>
                  </ul>
      </ul>
  </nav>
</header>
      <main>
          <div class="user">
              <h1 id="username">
                  @${username}
                  ${approved ? '<div class="dropdown"><img src="/assets/images/authorised.png" id="approved" width="50px" class="role-icon"><div class="dropdown-content">Verified Seller</div></div> ' : ''}
                  ${approved ? '<body style="background-image: url(/backend/verified.webp); background-repeat: repeat; background-size: cover; background-color: #3498DB;">' : ''}
                  ${role === 'developer' ? '<div class="dropdown"><img src="/assets/images/developer.png" id="developer" width="50px" class="role-icon"><div class="dropdown-content">Site Developer</div></div>' : ''}
                  ${role === 'moderator' ? '<div class="dropdown"><img src="/assets/images/moderator.png" id="moderator" width="50px" class="role-icon"><div class="dropdown-content">Moderation Team</div></div>' : ''}
                  ${role === 'support' ? '<div class="dropdown"><img src="/assets/images/support.png" id="support" width="50px" class="role-icon"><div class="dropdown-content">Support Team</div></div>' : ''}
                  ${role === 'owner' ? '<div class="dropdown"><img src="/assets/images/owner.png" id="theceo" width="50px" class="role-icon"><div class="dropdown-content">Site Owner</div></div>' : ''}
              </h1>
              <hr>
          </div>
          <section class="aboutt">
              <div class="about">
                  <h1>About</h1>
                  <p><span style="color: black">About Me:</span> ${aboutMe}</p>
                  <br>
                  <p><span style="color: black">Location:</span> ${location}</p>
                  <br>
                  <p><span style="color: black">Member since</span> ${dateJoined}</p>
              </div>
              <section class="badge-container">
                  <section class="badges">
                        ${approved ? '<div class="badge"><div class="badge-icon"><img src="/assets/images/authorised.png"></div><div class="badge-label"><h2>Verified Seller</h2></div></div>' : ''}
                      <div class="badge">
                        <div class="badge-icon"><img src="/assets/images/badges/${updatedBadgeNumber}.png" alt="Badge ${updatedBadgeNumber}"></div>
                        <div class="badge-label"><h2>Badge ${updatedBadgeNumber}</h2></div>
                      </div>
                      ${earlyuser ? '<div class="badge"><div class="badge-icon"><img src="/assets/images/badges/earlyadop.png"></div><div class="badge-label"><h2>Early Supporter</h2></div></div>' : ''}
                      </div>
                  </section>
              </section>
          
      </main>
      <footer>
          <div class="footer-container">
              <div class="footer-section">
                  <h3>About Hexxa</h3>
                  <p>Hexxa is an online marketplace that offers a wide range of products from electronics to clothing. We have a wide range of brands to choose from and we are committed to providing our customers with the best shopping experience possible.</p>
              </div>
              <div class="footer-section">
                  <h3>Customer Service</h3>
                  <ul>
                      <li><a href="#">Contact Us</a></li>
                      <li><a href="#">FAQs</a></li>
                      <li><a href="#">Returns &amp; Refunds</a></li>
                      <li><a href="#">Shipping &amp; Delivery</a></li>
                  </ul>
              </div>
              <div class="footer-section">
                  <h3>Connect with Us</h3>
                  <ul>
                      <li><a href="#">Facebook</a></li>
                      <li><a href="#">Twitter</a></li>
                      <li><a href="#">Instagram</a></li>
                      <li><a href="#">Linkedin</a></li>
                  </ul>
              </div>
          </div>
          <div class="footer-bottom">
              <p>&copy; 2023 Hexxa. All Rights Reserved.</p><p>Terms &amp; Conditions | Privacy Policy</p><p>Hexxa is apart of the hdev group</p>
              </p>
          </div>
      </footer>
      <script src="/backend/user.js"></script>
      <script src="/backend/header.js"></script>
      <script src="/backend/basca.js"></script>
  </body>
  </html>
`;
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post('/check-username', (req, res) => {
    const username = req.body.username;

    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading user data');
            return;
        }

        const users = JSON.parse(data);
        const isUsernameTaken = users.some(user => user.username === username);

        if (isUsernameTaken) {
            res.send({ available: false });
        } else {
            res.send({ available: true });
        }
    });
});



app.get('/logout', (req, res) => {
  res.clearCookie('session_token');
  req.session.destroy();
  res.redirect('/');
});

app.post('/add-to-basket', (req, res) => {
  const { productID, username } = req.body;

  fs.readFile('basket.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          res.status(500).json({ success: false, message: 'Error reading basket data' });
          return;
      }

      let basket = JSON.parse(data);

      const existingProduct = basket.find(item => item.id === productID);

      if (existingProduct) {
          existingProduct.quantity++;
      } else {
          basket.push({ id: productID, quantity: 1, username: username,});
      }

      fs.writeFile('basket.json', JSON.stringify(basket), 'utf8', (err) => {
          if (err) {
              console.error(err);
              res.status(500).json({ success: false, message: 'Error updating basket data' });
          } else {
              console.log('Product added to basket successfully!');
              res.json({ success: true, message: 'Product added to basket successfully' });
          }
      });
  });
});

app.get('/basket',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'basket.html'));
});


// Helper function to read and write basket data
function readBasketData() {
  try {
      const rawData = fs.readFileSync('basket.json');
      return JSON.parse(rawData);
  } catch (error) {
      return [];
  }
}

function writeBasketData(data) {
  fs.writeFileSync('basket.json', JSON.stringify(data));
}

app.get('/getBasket', requireAuth, (req, res) => {
  const { username } = req.user; // Assuming req.user contains the authenticated user's information
  const basket = readBasketData();
  const userBasket = basket.filter(item => item.username === username);
  res.json(userBasket);
  });

  app.post('/add-to-basket', (req, res) => {
  const { productID, username } = req.body;
  const basket = readBasketData();

  const existingProduct = basket.find(item => item.id === productID && item.username === username);

  if (existingProduct) {
      existingProduct.quantity++;
  } else {
      basket.push({ id: productID, quantity: 1, username });
  }

  writeBasketData(basket);

  res.json({ success: true, message: 'Product added to basket successfully' });
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());


  const userDatabase = 'users.json';
  const itemsDatabase = 'items.json';

  // Helper function to read and write JSON files
  function readJSONFile(filename) {
  return JSON.parse(fs.readFileSync(filename));
  }

  function writeJSONFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  }

  app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'dashboard.html'));
  },

  // Route to serve the dashboard (requires authentication)
  app.get('/dashboard', requireAuth, (req, res) => {
  const username = req.session.user;
  const items = readJSONFile(itemsDatabase);
  const userItems = items.filter(item => item.seller === username);
  const itemnumbers = userItems.length;

  if (itemnumbers === 0) {
  // If the user has no items listed, render a message or redirect to a different page
  res.send("You have no items listed for sale.");
  } else {
  // If the user has items listed, proceed with rendering the dashboard
  const htmlContent = fs.readFileSync('assets/html/dashboard.html', 'utf8');

  const htmlItems = userItems.map(item => `
  <div class="item">
    <div class="itemt">
      <h3>${item.productName}</h3>
    </div>
    <div class="itemd">
      <p>${item.description}</p>
    </div>
    <div class="itemp">
      <p>£${item.price}</p>
    </div>
    <div class="options">
      <button class="instock" onclick="togglePopup('stockPopup')">Is the item in stock?</button>
      <button class="price" onclick="togglePopup('pricePopup')">Change Price</button>
      <button class="title" onclick="togglePopup('titlePopup')">Change Title</button>
      <button class="description" onclick="togglePopup('descriptionPopup')">Change Description</button>
      <button class="delete" onclick="togglePopup('deletePopup')">Delete Item</button>
    </div>
  </div>
  </div>
  </section>
  <div id="stockPopup" class="popup">
  <button class="closebtn">Close</button>
  <h2>Stock Popup</h2>
  <h3>Is the item in stock?</h3>
  <p>Currently it is ${item.inStock ? 'in stock' : 'out of stock'}</p>
  <div class="buttonholder">
    <form action="/changeStock" method="post">
      <input type="hidden" name="itemId" value="${item.productId}">
      <input type="hidden" name="newStock" value="${item.inStock ? 'false' : 'true'}">
      <button class="outofstock">Out of Stock</button>
      <button class="instock1">In Stock</button>
    </form>
  </div>
  <button class="closebtn" onclick="closePopup('stockPopup')">Save</button>
  </div>

  <!-- Price Popup -->
  <form id="priceForm" action="/changePrice" method="POST">
  <div id="pricePopup" class="popup">
    <h2>Price Popup</h2>
    <h3>Raise or lower your prices</h3>
    <p>Currently it is £${item.price}</p>
    <input type="number" id="newPrice" name="newPrice" placeholder="New Price" step="any" required maxlength="6">
    <button type="submit" class="closebtn">Save</button>
  </div>
  </form>

  <!-- Title Popup -->
  <div id="titlePopup" class="popup">
  <button class="closebtn" onclick="closePopup('deletePopup')>Close</button>
  <h2>Title Popup</h2>
  <h3>Change the title of your item</h3>
  <p>Currently it is ${item.productName}</p>
  <form action="/changeTitle" method="POST">
    <input type="hidden" name="itemId" value="${item.productId}">
    <input type="text" name="productName" placeholder="Product Name" maxlength="40" required>
    <button type="submit" class="closebtn">Close</button>
  </form>
  </div>

  <!-- Description Popup -->
  <div id="descriptionPopup" class="popup">
  <button class="closebtn" onclick="closePopup('deletePopup')>Close</button>
    <h2>Description Popup</h2>
    <h3>Change the description of your item</h3>
    <p>Currently it is ${item.description}</p>
    <input type="text" id="description" name="description" placeholder="Description" maxlength="100" required>
    <button class="closebtn" onclick="closePopup('descriptionPopup')">Save</button>
  </div>

  <!-- Delete Popup -->
  <div id="deletePopup" class="popup">
  <button class="closebtn" onclick="closePopup('deletePopup')>Close</button>
    <h2>Delete Popup</h2>
    <h3>Are you sure you want to delete this item?</h3>
    <button class="delete1">Delete</button>
    <button class="closebtn" onclick="closePopup('deletePopup')">Close</button>
  </div>
  <!-- Overlay -->
  <div id="overlay" class="overlay"></div>
  `).join('');

  const modifiedHtmlContent = htmlContent.replace('<div class="containerr">', `<div class="containerr">${htmlItems}`);
  res.send(modifiedHtmlContent);
  }
  }));
  app.post('/changeStock', (req, res) => {
  try {
  const itemId = parseInt(req.body.itemId); // Convert itemId to a number
  const newStock = req.body.newStock === 'true';

  let items = readJSONFile(itemsDatabase);

  // Find the item by its ID and update the inStock property
  const updatedItems = items.map(item => {
    if (item.productId === itemId) {
      item.inStock = newStock;
    }
    return item;
  });

  writeJSONFile(itemsDatabase, updatedItems);

  res.redirect('/success');
  console.log('Stock changed successfully!');
  } catch (error) {
  console.error('Error:', error.message);
  res.status(500).json({ success: false, error: error.message });
  }
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const itemsDatabase1 = 'items.json';

  app.post('/changeTitle', (req, res) => {
  const itemId = req.body.itemId;
  const newTitle = req.body.productName;

  // Read the existing items from the JSON file
  let items = readJSONFile(itemsDatabase1);

  // Find the item by its ID and update the title
  const updatedItems = items.map(item => {
  if (item.productId === itemId) {
    item.productName = newTitle;
  }
  return item;
  });

  // Write the updated items back to the JSON file
  writeJSONFile(itemsDatabase1, updatedItems);

  // Respond with success
  res.json({ success: true });

  // Log the change to the console
  console.log('Title changed successfully! New Title:', newTitle);
  });


  // Route to handle changing description
  app.post('/changeDescription', (req, res) => {
  const itemId = req.body.itemId; // Assuming you have an input field with name="itemId"
  const newDescription = req.body.newDescription; // Assuming you have an input field with name="newDescription"

  let items = readJSONFile(itemsDatabase);

  // Find the item by its ID and update the description
  const updatedItems = items.map(item => {
  if (item.productId === itemId) {
    item.description = newDescription;
  }
  return item;
  });

  writeJSONFile(itemsDatabase, updatedItems);

  res.json({ success: true });
  });

  // Route to handle deleting an item
  app.post('/deleteItem', (req, res) => {
  const itemId = req.body.itemId; // Assuming you have an input field with name="itemId"

  let items = readJSONFile(itemsDatabase);

  // Filter out the item to be deleted
  const updatedItems = items.filter(item => item.id !== itemId);

  writeJSONFile(itemsDatabase, updatedItems);

  res.json({ success: true });
  });
  app.post('/changePrice', (req, res) => {
  try {
  const itemId = req.body.itemId; // Assuming you have an input field with name="itemId"
  const newPrice = req.body.newPrice; // Assuming you have an input field with name="newPrice"

  let items = readJSONFile(itemsDatabase);

  // Find the item by its ID and update the price
  const updatedItems = items.map(item => {
    if (item.id === itemId) { // Update this line to match your actual property name (e.g., productId)
      item.price = newPrice;
    }
    return item;
  });

  writeJSONFile(itemsDatabase, updatedItems);

  res.json({ success: true });
  console.log('Price changed successfully!');
  } catch (error) {
  console.error('Error:', error.message);
  res.status(500).json({ success: false, error: error.message });
  }
  });

  app.set('view engine', 'ejs');

  app.get('/getCurrentUser', (req, res) => {
  const username = req.session.user;
  res.json({ username });
  });

  app.get('/dashboardData', (req, res) => {
  const username = req.session.user;
  const users = readJSONFile('users.json');
  const items = readJSONFile('items.json');
  const userItems = items.filter(item => {
  return item.seller === username;
  });
  const itemnumbers = userItems.length;

  // Send the data back to the client as JSON
  res.json({ username, itemnumbers });
  });

  app.get('/team', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'team.html'));
  });

  app.get('/basket',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'basket.html'));
  });
  const basketDatabase = 'basket.json';

  // Route to add items to the basket
  app.post('/addToBasket', (req, res) => {
  try {
  const { productName, inStock, seller, cost } = req.body;

  let basket = readJSONFile(basketDatabase);

  // Check if the item already exists in the basket
  const existingItem = basket.items.find(item => item.productName === productName);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    basket.items.push({ productName, inStock, seller, cost, quantity: 1 });
  }

  writeJSONFile(basketDatabase, basket);

  res.json({ success: true });
  console.log('Item added to basket successfully!');
  } catch (error) {
  console.error('Error:', error.message);
  res.status(500).json({ success: false, error: error.message });
  }
  });
  // Function to read JSON file
  function readJSONFile(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
    return { items: [] };
  }
  }

  // Serve static files from the 'public' directory
  app.use(express.static('public'));

  app.get('/deliverysupport',requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/support/delivery', 'delivery.ticket.html'))
  });
  app.get('/paymentsupport',requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/support/payment', 'payment.ticket.html'))
  });
  app.get('/accountsupport',requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/support/account', 'account.ticket.html'))
  });
  app.get('/modsupport',requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/support/moderation', 'moderation.ticket.html'))
  });

  // Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Serve static files (if needed)
app.use(express.static('public'));

app.use(express.json());

// Assuming ticketCount is declared globally
let ticketCount = 0;
app.use(express.json());
// Form submission endpoint
app.post('/ticket', (req, res) => {
  const ticketData = req.body;
  try {
      const existingTickets = JSON.parse(fs.readFileSync('tickets.json', 'utf-8')) || [];

      // Assign a unique ID
      ticketData.id = ++ticketCount;

      // Add the new ticket
      existingTickets.push(ticketData);

      // Write the updated array back to the JSON file
      fs.writeFileSync('./tickets.json', JSON.stringify(existingTickets, null, 2));

      // Respond to the client
      res.json({ message: 'Ticket submitted successfully!' });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tickets', (req, res) => {
  // Serve the HTML page for the /tickets route
  res.sendFile(path.join(__dirname, 'assets/support/', 'tickets.html'));
});

app.get('/tickets/data', (req, res) => {
  try {
    // Assuming tickets.json is in the same directory as server.js
    const rawData = fs.readFileSync('tickets.json');
    const tickets = JSON.parse(rawData);

    // Filter tickets for the current user
    const userTickets = tickets.filter(ticket => ticket.username === req.session.user);

    res.json(userTickets);
  } catch (error) {
    console.error('Error reading tickets.json:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const tickets = JSON.parse(fs.readFileSync('tickets.json', 'utf8'));

app.get('/ticket/:id', (req, res) => {
  const ticketId = parseInt(req.params.id);
  const ticketData = tickets.find((ticket) => ticket.id === ticketId);

  if (!ticketData) {
    res.status(404).send('Ticket not found');
    return;
  }
  const ticketMessages = require('./ticketmessages.json');
  const ticketMessagesData = ticketMessages.filter((message) => message.ticketId === ticketId);
  const messagesHTML = ticketMessagesData.map((ticketData) => generateMessagesHTML(ticketData)).join('');

  // Replace placeholders in the template with actual ticket data and messages`
  const generatedPage =
  `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hexxa</title>
        <link rel="icon" href="/assets/images/favicon.png">
        <link rel="stylesheet" href="/assets/css/header.css">
        <link rel="stylesheet" href="/assets/css/footer.css">
        <link rel="stylesheet" href="/assets/css/tframe.css">
    </head>
    <body>
        <header class="issues">
            <div class="issuee">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script>
            $(document).ready(function() {
                $('.issuee').load('/assets/html/header.html');
            });
        </script>
        </div>
        </header>
        <header class="tophead">
        <div class="search-container">
            <div class="search-box">
                <input type="text" placeholder="Search for products, brands and more with Hexxa">
                <button>Search</button>
            </div>
        </div>
        <div class="containe">
            <div class="login">
                <a class="text" href="" id="link"><span id="username"></span></a>
            </div>
            <p style="color: white; font-size: 1.2rem;">|</p>
            <div class="notifs">
                <a href="/notifications" class="text">Notifications</a>
            </div>
                <img src="/assets/images/notifs.png" height="55px" alt="Basket" class="basket">
            <p style="color: white; font-size: 1.2rem;">|</p>
            <div class="basket">
                <a href="/basket" class="text"><img src="/assets/images/shoppingb.png" height="100px" alt="Basket" class="basket"></a>
            </div>
        </div>
        </header>
        <header>
            <img src="/assets/images/favicon.png" alt="Hexxa Logo" height="100px">
            <nav>
                <ul>
                        <li class="box buyhover"><p class="text buyhover">Buy Items</p>
                            <ul class="buyitems">
                                <li><a href="/allitems" class="text buyhover">Browse Items</a></li>
                                <li><a href="/shopping" class="text buyhover">Store front</a></li>
                            </ul>
                        </li>
                        <li class="box buyhover"><p class="text buyhover">Manage Items</p>
                            <ul class="buyitems">
                                <li><a href="/sell" class="text buyhover">Sell with Hexxa</a></li>
                                <li><a href="/dashboard" class="text buyhover">Manage your Items</a></li>
                            </ul>
                        </li>
                        <li class="box buyhover"><p class="text buyhover" href="">Help</p>
                            <ul class="buyitems">
                                <li><a href="/faq" class="text buyhover">FAQs</a></li>
                                <li><a href="/support" class="text buyhover">Support</a></li>
                            </ul>
                        </li>
                            <li class="box buyhover"><p class="text buyhover">Account</p>
                                <ul class="buyitems">
                                <li><a href="" class="text buyhover">Account Settings</a></li>
                                <li><a href="" class="text buyhover">Orders</a></li>
                                <li><a href="" class="text buyhover">Saved Items</a></li>
                                <li><a href="" class="text buyhover">Sign Out</a></li>
                            </ul>
                </ul>
            </nav>
    </header>
    <main>
    <section>
    <div class="top">
        <h id="topper"><span id="subject">${ticketData.subject}</span></h> 
        <h class="ids">#<span id="ids">${ticketData.id}</span></h>
    </div>
    <div class="midtop">
        <div class="status">
        <svg aria-hidden="true" height="36" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" id="sign" class="${ticketData.status.toUpperCase() === 'PENDING' ? 'pending' : ticketData.status.toUpperCase() === 'OPEN' ? 'open' : 'archived'}">
        <path d="M4.25 7.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z"></path>
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path>
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path>
    </svg>
    <h1 class="textstat open">Status: <span id="status">${ticketData.status}</span></h1>
    </div>
                        <div class="date">
                            <h1 class="g">Date Created: <span id="date">${formatDate(ticketData.timestamp)}</span></h1>
                        </div>
                    </div>
                </section>
                <section>
                    <div class="messagecontainer">
                        ${generateMessagesHTML(ticketData)}
                    </div>
                </section>
                <section>
                <div class="message-send-container">
                <form method="post" action="/message">
                        <textarea name="message" id="message2" class="message-send" cols="30" rows="10" minlength="5" maxlength="5000" placeholder="Enter your reply here"></textarea>
                        <button type="submit" class="message-send-button" id="send">Send Reply</button>
                    </form>
                </div>
            </section>
            </main>
            <script src="/backend/header.js"></script>
<script src="/backend/support.js"></script>
<footer>
<div class="footer-container">
    <div class="footer-section">
        <h3>About Hexxa</h3>
        <p>Hexxa is an online marketplace that offers a wide range of products from electronics to clothing. We have a wide range of brands to choose from and we are committed to providing our customers with the best shopping experience possible.</p>
    </div>
    <div class="footer-section">
        <h3>Customer Service</h3>
        <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Returns &amp; Refunds</a></li>
            <li><a href="#">Shipping &amp; Delivery</a></li>
        </ul>
    </div>
    <div class="footer-section">
        <h3>Connect with Us</h3>
        <ul>F
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Linkedin</a></li>
        </ul>
    </div>
</div>
<div class="footer-bottom">
    <p>&copy; 2023 Hexxa. All Rights Reserved.</p><p>Terms &amp; Conditions | Privacy Policy</p><p>Hexxa is apart of the hdev group</p>
    </p>
</div>
</footer>
<script src="/backend/messageclient.js"></script>
</body>
</html>
  `;
  res.send(generatedPage + messagesHTML);
});

function generateMessagesHTML(ticketData) {
  const initialMessage = `
    <div class="message">
      <div class="messagehead">
        <div style="display: flex; align-items: center;">
          <div style="flex-grow: 1;">
            <h1 class="username">${ticketData.username}</h1>
          </div>
          <div class="supporttag">
            <p>${ticketData.form}</p>
          </div>
          <div style="margin-left: 10px; font-size: 0.6rem; color: black; top: 19px;">
            <h1>commented on <span id="timestamp">${formatDate(ticketData.timestamp)}</span></h1>
          </div>
        </div>
      </div>
      <div class="messagebody">
        <p id="message">${ticketData.message}</p>
      </div>
      <div class="timeline">
        <div class="bottom-connecting-line"></div>
      </div>
    </div>
  `;
  
  const otherMessages = (ticketData.messages || []).map((message) => {
    return `
      <div class="message">
        <div class="messagehead">
          <div style="display: flex; align-items: center;">
            <div style="flex-grow: 1;">
              <h1 class="username">${message.username}</h1>
            </div>
            <div class="supporttag">
              <p>${message.form}</p>
            </div>
            <div style="margin-left: 10px; font-size: 0.6rem; color: black; top: 19px;">
              <h1>commented on <span id="timestamp">${formatDate(message.timestamp)}</span></h1>
            </div>
          </div>
        </div>
        <div class="messagebody">
          <p id="message">${message.reply}</p>
        </div>
        <div class="timeline">
          <div class="bottom-connecting-line"></div>
        </div>
      </div>
    `;
  }).join('');


return initialMessage + otherMessages;
};
// Read the ticketmessages.json file
fs.readFile('ticketmessages.json', 'utf-8', (err, fileContent) => {
  if (err) {
    console.error(err);
    return;
  }

  // Parse the JSON content
  const ticketData = JSON.parse(fileContent);

  // Use the ticketData object as needed

  // Generate HTML for each message
  const messagesHTML = ticketData.map((message) => `
    <div class="message">
      <div class="messagehead">
        <div style="display: flex; align-items: center;">
          <div style="flex-grow: 1;">
            <h1 class="username">${message.username}</h1>
          </div>
          <div class="supporttag">
            <p>${message.form}</p>
          </div>
          <div style="margin-left: 10px; font-size: 0.6rem; color: black; top: 19px;">
            <h1>commented on <span id="timestamp">${formatDate(message.timestamp)}</span></h1>
          </div>
        </div>
      </div>
      <div class="messagebody">
        <p id="message">${message.reply}</p>
      </div>
      <div class="timeline">
        <div class="bottom-connecting-line"></div>
      </div>
    </div>
  `).join('');
});





function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
app.use(bodyParser.json());

// Handle POST request to '/message' endpoint

app.post('/message', async (req, res) => {
  try {
      const message = req.body.message;
      const ticketId = req.body.ticketId;

      console.log('Received Message:', message);
      console.log('Received Ticket ID:', ticketId);
  // Read the existing messages from ticketmessages.json
  fs.readFile('ticketmessages.json', 'utf-8', (err, fileContent) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      const messages = JSON.parse(fileContent);

      // Add the new message and ticket ID to the messages array
      messages.push({ message: message, ticketId: ticketId });

      // Write the updated messages back to ticketmessages.json
      fs.writeFile('ticketmessages.json', JSON.stringify(messages), (err) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ success: false, error: 'Internal Server Error' });
          }

          // Send a response back to the client
          res.status(200).json({ success: true, message: { message }, id: { ticketId } });
  });
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
}
});
  // Route to get the basket items
  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
  });
