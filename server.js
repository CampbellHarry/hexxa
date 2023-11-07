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
  const { username, password, approved } = req.body;
  const role = 'user';
  const dateJoined = new Date().toLocaleDateString();
  const aboutMe = 'This user has not set an about me yet.';
  console.log('Received signup request with username:', username, 'and password:', password); // Debug log

  fs.readFile('./users.json', 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading users.json:', err);
          return res.json({ success: false });
      }

      let users = JSON.parse(data);
      users.push({ username, password, approved, role, dateJoined, aboutMe });

      console.log('Updated users array:', users); // Debug log

      fs.writeFile('./users.json', JSON.stringify(users), (err) => {
          if (err) {
              console.error('Error writing to users.json:', err);
              return res.json({ success: false });
          }
          console.log('Data written to users.json');
          res.json({ success: true });
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


app.get('/items.json', (_req, res) => {
  res.sendFile(path.join(__dirname, 'items.json'));
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

  const user = users.find(user => user.username === username && user.password === password);
  
  if (user) {
    const sessionToken = generateSessionToken();
    user.sessionToken = sessionToken;
    saveUsers();

    res.cookie('session_token', sessionToken);
    req.session.user = user.username; // Set the session variable
    res.redirect('/shopping');
  } else {
    res.send('Invalid username or password.');
    console.log('Invalid username or password.', password, username);
  }
});

const cookieParser = require('cookie-parser');

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
      <header>
          <img src="/assets/images/favicon.png" class="logo" alt="Hexxa Logo" height="100px">
          <div class="search-container">
              <div class="search-box">
                  <input type="text" placeholder="Search for products, brands and more with Hexxa">
                  <button>Search</button>
              </div>
          </div>
          <div class="basket">
              <img src="/assets/images/shoppingb.png" height="100px" alt="Basket">
                  <p>0</p>
              </div>
                  <a href="" class="signup" id="username-display">Welcome, <span id="username"></span>!</a>
              </div>
          <header class="header1">
              <nav>
                  <ul>
                      <li class="box"><a class="text" href="/">Home</a></li>
                      <li class="box"><a class="text" href="">Customer Service</a></li>
                      <li class="box"><a class="text" href="">Contact</a></li>
                      <li class="box"><a class="text" href="shopping">Shopping</a></li>
                      <li class="box"><a class="text" href="">Todays Deals</a></li>
                      <li class="box"><a class="text" href="allitems">All Items</a></li>
                      <li class="box"><a class="text" href="sell">Sell a Item</a></li>
                  </ul>
              </nav>
          </header>
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
            <div id="approved" style="border: ${product.approved ? 'border: 1px solid #005700;' : '2px solid red'}">
              THIS SELLER IS <span>${product.approved ? 'APPROVED' : 'NOT APPROVED'}</span>
            </div>             
              <hr>
              <div id="price">Price: £${product.price}</div>
              <div id="delivery">Delivery: ${product.delivery}</div>
              <hr>
              <div id="instock">${product.inStock ? 'In stock' : 'Out of stock'}</div>
              <hr>
              <button id="addbasket">Add to Basket</button>
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
      <script>
    fetch('/getUsername')
      .then(response => response.json())
      .then(data => {
        var usernameElement = document.getElementById("username");
        usernameElement.innerHTML = data.username;
      })
      .catch(error => console.error('Error:', error));
  </script>
  </body>
  </html>
  `;
}
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


app.post('/success',requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'success.html'));
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
  const imageUrl = image ? `/uploads/${image.filename}` : '';

  // Read sellers data from file
  const sellerData = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

  // Find the seller in the data
  const sellerInfo = sellerData.find(sellerInfo => sellerInfo.username === seller);

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
    sold: 0,
    totalCost: 0
  };

  const rawData = fs.readFileSync('./items.json');
  let items = JSON.parse(rawData);

  items.push(itemData);

  fs.writeFileSync('./items.json', JSON.stringify(items));

  res.redirect('/success');
});

const userss = require('./users.json');

app.get('/user/:username', (req, res) => {
  const username = req.params.username; // Get the username from the route parameter

  const user = userss.find(item => item.username === username);

  if (!user) {
    return res.status(404).send('User not found');
  }

  res.send(renderUserPage(user));
});


function renderUserPage(user) {
  const { username, aboutMe, dateJoined, approved, role, } = user;
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
      <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.4/purify.min.js"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <body>
      <header>
          <img src="/assets/images/favicon.png" class="logo" alt="Hexxa Logo" height="100px">
          <div class="search-container">
              <div class="search-box">
                  <input type="text" placeholder="Search for products, brands and more with Hexxa">
                  <button>Search</button>
              </div>
          </div>
          <div class="basket">
              <img src="/assets/images/shoppingb.png" height="100px" alt="Basket">
                  <p>0</p>
              </div>
                  <a href="" class="signup" id="username-display">Welcome, <span id="username1"></span>!</a>
              </div>
          <header class="header1">
              <nav>
                  <ul>
                      <li class="box"><a class="text" href="../">Home</a></li>
                      <li class="box"><a class="text" href="">Customer Service</a></li>
                      <li class="box"><a class="text" href="">Contact</a></li>
                      <li class="box"><a class="text" href="../shopping">Shopping</a></li>
                      <li class="box"><a class="text" href="">Todays Deals</a></li>
                      <li class="box"><a class="text" href="../allitems">All Items</a></li>
                      <li class="box"><a class="text" href="../sell">Sell a Item</a></li>
                  </ul>
              </nav>
          </header>
      </header>
      <main>
          <section>
              <div class="user">
                  <h1 id="username">
                    ${username} 
                    ${approved ? '<div class="dropdown"><img src="/assets/images/authorised.png" id="approved" width="50px" class="role-icon"><div class="dropdown-content">Verified Seller</div></div>' : ''}
                    ${role === 'developer' ? '<div class="dropdown"><img src="/assets/images/developer.png" id="developer" width="50px" class="role-icon"><div class="dropdown-content">Site Developer</div></div>' : ''}
                    ${role === 'moderator' ? '<div class="dropdown"><img src="/assets/images/moderator.png" id="moderator" width="50px" class="role-icon"><div class="dropdown-content">Moderation Team</div></div>' : ''}
                    ${role === 'support' ? '<div class="dropdown"><img src="/assets/images/support.png" id="support" width="50px" class="role-icon"><div class="dropdown-content">Support Team</div></div>' : ''}
                    ${role === 'owner' ? '<div class="dropdown"><img src="/assets/images/owner.png" id="theceo" width="50px" class="role-icon"><div class="dropdown-content">Site Owner</div></div>' : ''}
                </h1>
              </div>
            </section>
          <section class="aboutt">
              <div class="about">
                  <h1>About</h1>
                  <p><span style="color: #CCCCCC">About Me:</span> ${aboutMe}</p>
                  <br>
                  <p><span style="color: #CCCCCC">Member since</span> ${dateJoined}</p>
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
      <script>
    fetch('/getUsername')
      .then(response => response.json())
      .then(data => {
        var usernameElement1 = document.getElementById("username1");
        usernameElement1.innerHTML = data.username;
      })
      .catch(error => console.error('Error:', error));
  </script>
  </body>
  </html>
`;
}



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

