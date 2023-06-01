const express = require('express');
const SibApiV3Sdk = require('sib-api-v3-sdk');

const app = express();
const port = process.env.PORT || 3000;

// Configure Sendinblue API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.API_KEY;

// Create a route to handle the email submission
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  const apiInstance = new SibApiV3Sdk.ContactsApi();
  const createContact = new SibApiV3Sdk.CreateContact();
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
