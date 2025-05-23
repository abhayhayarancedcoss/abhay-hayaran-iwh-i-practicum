const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const objectType = 'pets';
    const properties = ['name', 'type', 'food'];

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    const url = `https://api.hubspot.com/crm/v3/objects/${objectType}?properties=${properties.join(
        ','
    )}`;

    try {
        const response = await axios.get(url, { headers });
        const pets = response.data.results || [];
        res.render('homepage', { title: 'Pet Records | HubSpot', pets });
    } catch (error) {
        console.error('Error fetching pet records:', error);
        res.status(500).send('Error fetching pet records');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const objectType = 'pets';
    const { name, type, food } = req.body;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    const postData = {
        properties: {
            name,
            type,
            food,
        },
    };

    const url = `https://api.hubspot.com/crm/v3/objects/${objectType}`;

    try {
        await axios.post(url, postData, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating pet record:', error);
        res.status(500).send('Error creating pet record');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
