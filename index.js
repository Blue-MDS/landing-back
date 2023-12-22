const express = require('express');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json())
app.use(cors({
    origin: process.env.FRONT_URL,
    optionsSuccessStatus: 200
  }));
  

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

app.post('/subscribe', (req, res) => {
  const { email } = req.body;
  let apiInstance = new SibApiV3Sdk.ContactsApi();

let createContact = new SibApiV3Sdk.CreateContact();
  createContact.email = email;

  apiInstance.createContact(createContact)
    .then(data => {
      console.log('Contact added successfully:', data);
      return res.status(200).json({ message: 'Contact added successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to add contact' });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
