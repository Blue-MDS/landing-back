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

app.post('/subscribe', async(req, res) => {
  const { email } = req.body;
  let apiInstance = new SibApiV3Sdk.ContactsApi();
  try {
    let contact = await apiInstance.getContactInfo(email);
    if (!contact.listIds.includes(7)) {
      let updateContact = new SibApiV3Sdk.UpdateContact();
      updateContact.listIds = [7];
      await apiInstance.updateContact(email, updateContact);
      return res.status(200).json({ message: 'Contact added successfully' });
    } else {
      return res.status(200).json({ error: 'Vous êtes déjà inscrit à notre Newsletter !' });
    }
  } catch (error) {
    if (error.status === 404) {
      let createContact = new SibApiV3Sdk.CreateContact();
      createContact.email = email;
      createContact.listIds = [7];
      await apiInstance.createContact(createContact);
      return res.status(200).json({ message: 'Contact added successfully' });
    }
    res.status(500).json({ error: 'Failed to add contact' });
  }
});

app.post('/preOrder', async(req, res) => {
  const { email, arome } = req.body;
  let apiInstance = new SibApiV3Sdk.ContactsApi();
  try {
    let contact = await apiInstance.getContactInfo(email);
    let existingAromes = contact.attributes && contact.attributes.AROME ? contact.attributes.AROME.split(',') : [];
    if (existingAromes.length && existingAromes.includes(arome)) {
      return res.status(200).json({ error: 'Vous êtes déjà intéressé par cet arôme' });
    } else {
      existingAromes.push(arome);
      let updateContact = new SibApiV3Sdk.UpdateContact();
      if (!contact.listIds.includes(9)) {
        updateContact.listIds = [9];
      }
      updateContact.attributes = { AROME: existingAromes.join(',') };
      await apiInstance.updateContact(email, updateContact);
      return res.status(200).json({ message: 'Contact updated successfully' });
    }
  } catch (error) {
    console.log('Error:', error);
    if (error.status === 404) {
      let createContact = new SibApiV3Sdk.CreateContact();
      createContact.email = email;
      createContact.listIds = [9];
      createContact.attributes = { AROME: arome };
      await apiInstance.createContact(createContact);
      return res.status(200).json({ message: 'Contact added successfully' });
    } else {
      res.status(500).json({ error: 'Failed to add contact' });
    }
  }
}
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
