const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51KpdLNLy0tV1iuNuGAA6ud707TfThaHLfAvP0Hcy3RLcBQXDsZvwDtifkFoL1DrHw1NSznbosgcAH8e3gdiGU9zJ00wp8l1zmr")

// API

// App config
const app = express();

// Middlewaves
app.use(cors({ origin: true }));
app.use(express.json());


// API routes
app.get('/', (request, response) => {
    response.status(200).send("hello world")});

app.post('/payments/create', async (request, response) => {
    const total = request.query.total;

    console.log("Payment Request Recieved PLAYBOI", total);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
    });

    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})

// Listen command
exports.api = functions.https.onRequest(app)

// http://localhost:5001/clone-825e6/us-central1/api

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
