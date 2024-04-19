const bodyParser = require('body-parser');

module.exports = app => {
    const payment = require("../controllers/payment.controller.js");
  
    var router = require("express").Router();
    app.use(bodyParser.json());
  
    // Create a payment link then store info in db
    router.post("/create-payment", payment.createPayment);

    // Retrieve payment 
    router.get("/get-payment", payment.getPayment);
  
    app.use('/api/payment', router);
    };