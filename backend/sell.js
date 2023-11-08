const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// set up rate limiter: maximum of five requests per minute
var express = require('express');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

app.use(limiter);

app.post('/submit', (req, res) => {
    const itemData = req.body;
    itemData.sold = 0;
    itemData.totalCost = 0;
    itemData.reviews = null;
  
    // Read the existing data from the JSON file
    const rawData = fs.readFileSync('items.json');
    let items = JSON.parse(rawData);
  
    // Add the new item to the array
    items.push(itemData);
  
    // Write the updated data back to the JSON file
    fs.writeFileSync('items.json', JSON.stringify(items));
  
    res.json({ success: true, message: 'Item added successfully!' });
  });