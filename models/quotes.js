const mongoose = require('mongoose');

// Define the Quote schema
const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: 'Anonymous' }
});

// Create the Quote model using the schema
const Quote = mongoose.model('Quote', quoteSchema);

// Export the model
module.exports = Quote;
