const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;
// Connect to your MongoDB instance (replace 'mongodb://localhost/mydatabase' with your MongoDB URL)
mongoose.connect('mongodb://127.0.0.1:27017/regis', { useNewUrlParser: true,
useUnifiedTopology: true });
// Create a Mongoose model (schema)
const User = mongoose.model('User', {
name: String,
  mobile: Number,
  password: String,
  address: String,
  voterId: Number,
  });

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
// Serve the HTML form
app.get('/', (req, res) => {
res.sendFile(__dirname + '/registration.html');
});
// Handle form submission
app.post('/submit', (req, res) => {
const { name,
    mobile,
    password,
    address,
    voterId} = req.body;
// Create a new User document and save it to MongoDB
const user = new User({ name,mobile,password,address,voterId });
user.save()
.then(() => {
res.send('Data has been saved to MongoDB.');
})
.catch((err) => {
console.error(err);
res.status(500).send('Error saving data to MongoDB.');
});
});
// Start the server
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});