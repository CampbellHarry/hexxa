const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// set up rate limiter: maximum of five requests per minute
var express = require('express');

// set up rate limiter: maximum of five requests per minute);

app.post('/submit', (req, res) => {
    const itemData = req.body;
    itemData.sold = 0;
    itemData.totalCost = 0;
    idemData.reviews = null;
  
    // Read the existing data from the JSON file
    const rawData = fs.readFileSync('items.json');
    let items = JSON.parse(rawData);
  
    // Add the new item to the array
    items.push(itemData);
  
    // Write the updated data back to the JSON file
    fs.writeFileSync('items.json', JSON.stringify(items));
  
    res.json({ success: true, message: 'Item added successfully!' });
  });