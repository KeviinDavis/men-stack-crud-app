// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();  // To use environment variables

const methodOverride = require('method-override');

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectToDatabase(); // Initiate the MongoDB connection

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set EJS as our view engine
app.set('view engine', 'ejs');

// Root route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Quotes App!');
});

// Import the Quote model
const Quote = require('./models/quotes');

// Route to show a form for adding a new quote
app.get('/quotes/new', (req, res) => {
  res.render('new'); // Render the 'new' view for the form
});

// POST route to add a new quote to the database
app.post('/quotes', async (req, res) => {
  try {
    // Create a new quote from form data
    const newQuote = new Quote({
      text: req.body.text,
      author: req.body.author || 'Anonymous',
    });
    await newQuote.save(); // Save the new quote to the database
    res.redirect('/quotes'); // Redirect to the list of quotes
  } catch (error) {
    res.status(400).send('Error saving quote: ' + error.message);
  }
});

// GET route to display all quotes
app.get('/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find(); // Find all quotes in database
    res.render('index', { quotes });
  } catch (error) {
    res.status(500).send('Error fetching quotes: ' + error.message);
  }
});

// PUT route to update a specific quote
app.put('/quotes/:id', async (req, res) => {
  try {
    await Quote.findByIdAndUpdate(req.params.id, {
      text: req.body.text,
      author: req.body.author,
    });
    res.redirect('/quotes'); // Redirect to the quotes list after updating
  } catch (error) {
    res.status(400).send('Error updating quote: ' + error.message);
  }
});

// GET route to show the edit form for a specific quote
app.get('/quotes/:id/edit', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    res.render('edit', { quote });
  } catch (error) {
    res.status(404).send('Quote not found');
  }
});

// DELETE route to remove a specific quote
app.delete('/quotes/:id', async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id); // Delete quote by ID
    res.redirect('/quotes'); // Redirect to the list of quotes
  } catch (error) {
    res.status(500).send('Error deleting quote: ' + error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
