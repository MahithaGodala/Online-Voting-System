const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Connect to MongoDB (replace 'your-mongodb-uri' with your MongoDB connection URI)
mongoose.connect('mongodb://127.0.0.1:27017/login', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for user data
const userSchema = new mongoose.Schema({
  mobile: Number,
  password: String,
  voterId: Number,
});

const User = mongoose.model('User', userSchema);

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Use EJS as the template engine
app.use(express.static(__dirname)); // Serve static files like CSS

// Serve the HTML login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Handle form submission
app.post('/', (req, res) => {
  const mobile = req.body.mobile;
  const password = req.body.password;
  const voterId = req.body.voterId;

  // You can now use the data in the 'mobile', 'password', and 'voterId' variables to perform authentication or user verification.
  // You can query the MongoDB database here to check the user's credentials.

  User.findOne({ mobile, password, voterId }, (err, user) => {
    if (err) {
      console.error(err);
      res.send('An error occurred');
    } else if (user) {
      // User found, perform login actions
      res.send('Login successful');
    } else {
      res.send('Invalid credentials');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
