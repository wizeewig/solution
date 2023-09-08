// Import necessary modules
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// JSON file to simulate a database
const pantryDataPath = 'pantry.json';

// Helper function to read JSON data from the file
function readPantryData() {
  const rawData = fs.readFileSync(pantryDataPath);
  return JSON.parse(rawData);
}

// Helper function to write JSON data to the file
function writePantryData(data) {
  fs.writeFileSync(pantryDataPath, JSON.stringify(data, null, 2));
}

// Create (POST) operation
app.post('https://getpantry.cloud/apiv1/pantry/465b8319-e70d-40c4-b75a-cbb28bbd871d/basket/NewBasket', (req, res) => {
    const pantryData = readPantryData();
    const newItem = req.body;
  
    pantryData.push(newItem);
    writePantryData(pantryData);
  
    res.json(newItem);
});

// Read (GET) operation
app.get('https://getpantry.cloud/apiv1/pantry/465b8319-e70d-40c4-b75a-cbb28bbd871d/basket/NewBasket', (req, res) => {
  const pantryData = readPantryData();
  res.json(pantryData);
});

// Read (GET) operation for listing baskets
app.get('https://getpantry.cloud/apiv1/pantry/465b8319-e70d-40c4-b75a-cbb28bbd871d', (req, res) => {
  const pantryData = readPantryData();
  const basketNameFilter = req.query.name; // Get the name filter from the query parameter
  const baskets = [];

  // Extract unique basket names from pantry items and filter based on the name filter
  pantryData.forEach(item => {
    if (item.basket && !baskets.includes(item.basket) && item.basket.includes(basketNameFilter)) {
      baskets.push(item.basket);
    }
  });

  res.json(baskets);
  });
  
// Update (PUT) operation
app.put('https://getpantry.cloud/apiv1/pantry/465b8319-e70d-40c4-b75a-cbb28bbd871d/basket/NewBasket', (req, res) => {
  const pantryData = readPantryData();
  const itemId = req.params.id;
  const updatedItem = req.body;

  // Find the index of the item with the given ID
  const itemIndex = pantryData.findIndex(item => item.id === itemId);

  if (itemIndex !== -1) {
    // Update the item
    pantryData[itemIndex] = updatedItem;
    writePantryData(pantryData);
    res.json(updatedItem);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Delete (DELETE) operation
app.delete('https://getpantry.cloud/apiv1/pantry/465b8319-e70d-40c4-b75a-cbb28bbd871d/basket/NewBasket', (req, res) => {
  const pantryData = readPantryData();
  const itemId = req.params.id;

  // Find the index of the item with the given ID
  const itemIndex = pantryData.findIndex(item => item.id === itemId);

  if (itemIndex !== -1) {
    // Remove the item
    const deletedItem = pantryData.splice(itemIndex, 1)[0];
    writePantryData(pantryData);
    res.json(deletedItem);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
