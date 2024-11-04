// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();  // To use environment variables

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
    res.redirect('/quotes'); // Redirect to the list of quotes (we’ll set up this route later)
  } catch (error) {
    res.status(400).send('Error saving quote: ' + error.message);
  }
});

// GET route to display all quotes
app.get('/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find(); // Find all quotes in database
    res.render('index', { quotes });
  } catch (error) { // Fix typo here (was "errer" in your code)
    res.status(500).send('Error fetching quotes: ' + error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
