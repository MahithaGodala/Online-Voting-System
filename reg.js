const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

mongoose.connect('mongodb://127.0.0.1:27017/reg', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  name: String,
  mobile: Number,
  password: String,
  email:String,
  address: String,
  voterId: Number
});


const voteSchema = new mongoose.Schema({
  voter_id:Number,
  vote: String // Define the structure for the vote option
  // Add any other fields you need for the vote data
});
const User=mongoose.model('User',userSchema);

const Vote = mongoose.model('Vote', voteSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});

app.post('/register', (req, res) => {
  const userData = {
    name: req.body.name,
    mobile: req.body.mobile,
    password: req.body.password,
	email:req.body.email,
    address: req.body.address,
    voterId: req.body['voter_id'],
  };

  User.create(userData, (err, user) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during registration');
    } else {
      // Redirect to login.html after successful registration
      res.redirect('/login');
    }
  });
});

app.post('/login', (req, res) => {
  const { mobile, password, voterId } = req.body;

  User.findOne({ mobile, password, voterId }, (err, user) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during login.');
    } else if (!user) {
      console.log('User not found in the database');
      res.send('Login failed. Invalid credentials. Please check your mobile number, password, and voter ID.');
    } else {
      console.log('Login successful');
      // Redirect to dashboard.html after successful login
      res.redirect('/vote.html');
    }
  });
});
// ...






// Serve login.html
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Serve home.html
app.get('/home.html', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});
app.post('/admin', (req, res) => {
    const adminUsername = req.body.username;
    const adminPassword = req.body.password;

    // Check if the provided username and password match the admin credentials
    if (adminUsername === 'mahi' && adminPassword === 'mahi12') {
        res.redirect('/modified.html'); // Redirect to /modified.html if credentials match
    } else {
        // Handle incorrect credentials, e.g., show an error message or redirect to another page
        res.send('Invalid credentials. Please try again.'); // Example error response
    }
});




app.post('/delete', (req, res) => {
        const recordId = req.body.name;
        // Use Mongoose to delete the record by its ID using deleteOne
        User.deleteOne({username: recordId}, (err) => {
          if (err) {
            res.send('Error deleting record');
          } else {
            console.log('deleted successfully');
      res.redirect('/home.html'); 
          }
        });
      });

app.get('/delete', (req, res) => {
  res.sendFile(__dirname + '/delete.html');
});
app.post('/display', (req, res) => {
        const voter_id = req.body.voter_id;
        // Use Mongoose to find the specific record by its ID
        User.findOne({voterId : voter_id }, (err, user) => {
          if (err) {
            res.send('Error finding user');
          } else if (!user) {
            res.send('User not found');
          } else {
            res.send(`
            <html>
            <head>
            <title>Display Record</title>
            </head>
            <body align="center">
              <h1>Record Details</h1>
              <table border="2" align="center" cellspacing="6" cellpaddin="6">
                <tr>
                  <td>Full name</td>
                  <td>${user.name}</td>
                </tr>
                <tr>
                  <td>Voter id</td>
                  <td>${user.voterId}</td>
                </tr>
                <tr>
                  <td>Phone Number</td>
                  <td>${user.mobile}</td>
                </tr>
                <tr>
                  <td>address</td>
                  <td>${user.address}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>${user.email}</td>
                </tr>
                 <tr>
                  <td>Password</td>
                  <td>${user.password}</td>
                </tr>
              </table><br>
              <button><a href="home.html">Go Back</a></button><br><br>
            </body>
          </html>
            `);
		  }
          
        });
      });
	  app.get('/displayall', (req, res) => {
    res.sendFile(__dirname + '/displayall.html');
  });
 
app.post('/displayall', (req, res) => {
        User.find({}, (err, records) => {
          if (err) {
            res.send('Error fetching records');
          } else {
            res.send(`
            <html>
            <head>
              <title>All Records</title>
            </head>
            <body align="center">
              <h1>All Records</h1>
              <table align="center" border="2" cellpadding="3" cellspacing="5">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Password</th>
                        <th>VoterId<th></th>
                        <th>Phone Number</th>
                        <th>Address</th>
						<th>Email</th>
                    </tr>
                </thead>
                <tbody>
                ${records.map(record => `
                  <tr> 
                    <td>${record.name}</td>  
                    <td>${record.password}</td> 
                    <td>${record.voterId}</td>
                    <td>${record.mobile}</td>
                    <td>${record.address}</td>  
					<td>${record.email}</td>  
                  </tr>
                `).join('')}
                </tbody>
              </table>
              <br><br>
              <br>
              <button><a href="/home.html">Go Back</a></button>
            </body>
          </html>
            `);
          }
        });
      });
	  app.get('/update', (req, res) => {
    res.sendFile(__dirname + '/update.html');
  });
app.post('/update', (req, res) => {
    const username = req.body.name; // Define 'username' based on the 'name' field from the request
    const password = req.body.password;
    const voter_id = req.body.voter_id;
    const phnno = req.body.mobile;
    const address = req.body.address;
	const email = req.body.email;

    // Use Mongoose to update the record by its ID using updateOne
    User.updateOne({name: username, password: password}, {voterId: voter_id, mobile: phnno, address: address,email:email}, (err) => {
        if (err) {
            res.send('Error updating record');
        } else {
            res.send(`<html>
                <body align="center">
				

                <h1>Record Updated Successfully.</h1><br><br>
                <center><button><a href="/home.html">Go Back</a></button></center>
                </body>
            </html>`);
        }
    });
});

app.post('/vote', (req, res) => {
 
  // Assuming you have a MongoDB model for storing votes (e.g., Vote)
  const voteData = {
	  voter_id:req.body.voter_id,
    vote: req.body.vote
    // You can associate the vote with the user who is logged in if needed
    // user: req.user, // You need to implement user authentication for this
  };
   
  // Save the vote data to MongoDB
  Vote.create(voteData, (err, vote) => {
    if (err) {
      console.error(err);
      res.send('An error occurred while storing your vote.');
    } else {
      // Redirect the user to home.html after voting
      res.redirect('/home.html');
    }
  });
});



app.post('/vdelete', (req, res) => {
        const recordId = req.body.voter_id;
        // Use Mongoose to delete the record by its ID using deleteOne
        Vote.deleteOne({username: recordId}, (err) => {
          if (err) {
            res.send('Error deleting record');
          } else {
            console.log('deleted successfully');
      res.redirect('/home.html'); 
          }
        });
      });

app.get('/vdelete', (req, res) => {
  res.sendFile(__dirname + '/vdelete.html');
});
app.post('/vdisplay', (req, res) => {
        const voter_id = req.body.voter_id;
        // Use Mongoose to find the specific record by its ID
        Vote.findOne({voter_id : voter_id }, (err, user) => {
          if (err) {
            res.send('Error finding user');
          } else if (!user) {
            res.send('User not found');
          } else {
            res.send(`
            <html>
            <head>
            <title>Display Record</title>
            </head>
            <body align="center">
              <h1>Record Details</h1>
              <table border="2" align="center" cellspacing="6" cellpaddin="6">
               
                <tr>
                  <td>VOTERID</td>
                  <td>${user.voter_id}</td>
                </tr>
                 <tr>
                  <td>VOTE</td>
                  <td>${user.vote}</td>
                </tr>
              </table><br>
              <button><a href="home.html">Go Back</a></button><br><br>
            </body>
          </html>
            `);
		  }
          
        });
      });
	  app.get('/vdisplayall', (req, res) => {
    res.sendFile(__dirname + '/vdisplayall.html');
  });
 
app.post('/vdisplayall', (req, res) => {
        Vote.find({}, (err, records) => {
          if (err) {
            res.send('Error fetching records');
          } else {
            res.send(`
            <html>
            <head>
              <title>All Records</title>
            </head>
            <body align="center">
              <h1>All Records</h1>
              <table align="center" border="2" cellpadding="3" cellspacing="5">
                <thead>
                    <tr>
                       
                        <th>VoterId<th></th>
                        <th>VOTE</th>
                       
                    </tr>
                </thead>
                <tbody>
                ${records.map(record => `
                  <tr> 
                    
                    <td>${record.voter_id}</td>
                    <td>${record.vote}</td>
                    
					
                  </tr>
                `).join('')}
                </tbody>
              </table>
              <br><br>
              <br>
              <button><a href="/home.html">Go Back</a></button>
            </body>
          </html>
            `);
          }
        });
      });
	  app.get('/update', (req, res) => {
    res.sendFile(__dirname + '/update.html');
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
