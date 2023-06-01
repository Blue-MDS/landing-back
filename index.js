const express = require('express');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json())
app.use(cors({
    origin: 'https://swipet.vercel.app',
    optionsSuccessStatus: 200
  }));
  

// Configure Sendinblue API client
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

// Create a route to handle the email submission
app.post('/subscribe', (req, res) => {
  const { email } = req.body;
  console.log(email);
  let apiInstance = new SibApiV3Sdk.ContactsApi();

let createContact = new SibApiV3Sdk.CreateContact();
  createContact.email = email;

  apiInstance.createContact(createContact)
    .then(data => {
      console.log('Contact added successfully:', data);
      res.status(200).json({ message: 'Contact added successfully' });
    })
    .catch(error => {
      console.error('Error adding contact:', error);
      res.status(500).json({ error: 'Failed to add contact' });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
