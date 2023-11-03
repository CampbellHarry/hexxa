const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer')

const app = express();

// Serve static files (CSS, images, JavaScript, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'index.html'));
});

app.get('/allitems', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'allitems.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'login.html'));
});

app.get('/shopping', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'shopping.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'signup.html'));
});

// Serve static files (CSS, images, JavaScript, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Define routes
app.get('/sell', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/html', 'sell.html'));
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const productId = Date.now();
    cb(null, `${productId}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', upload.single('image'), (req, res) => {
    const productId = Date.now(); // Generate a unique timestamp-based ID

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

    res.json({ success: true, message: 'Item added successfully!' });
});

// Endpoint to handle form submission
app.post('/submitForm', (req, res) => {
    const newItem = req.body;

    fs.readFile('items.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const items = JSON.parse(data);
        items.push(newItem);

        fs.writeFile('items.json', JSON.stringify(items), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.send('Item added successfully');
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/submit', upload.single('image'), (req, res) => {
    const productId = Date.now(); // Generate a unique timestamp-based ID

    const productName = req.body.productName;
    const category = req.body.category;
    const condition = req.body.condition;
    const price = req.body.price;
    const description = req.body.description;

    const image = req.file;
    const imageUrl = `/uploads/${image.filename}`;

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

    res.json({ success: true, message: 'Item added successfully!' });
});

// Parse incoming request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle form submission
app.post('/submitForm', (req, res) => {
    const newItem = req.body;

    fs.readFile('items.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const items = JSON.parse(data);
        items.push(newItem);

        fs.writeFile('items.json', JSON.stringify(items), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.send('Item added successfully');
        });
    });
});
