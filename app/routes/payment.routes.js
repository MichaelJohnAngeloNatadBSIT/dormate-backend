const bodyParser = require('body-parser');

module.exports = app => {
    const payment = require("../controllers/payment.controller.js");
  
    var router = require("express").Router();
    app.use(bodyParser.json());
  
    // Create a payment link then store info in db
    router.post("/create-payment", payment.createPayment);

    // Retrieve payment 
    router.get("/get-payment/:reference_number", payment.getPayment);

    router.put("update-payment/:checkout_url", payment.update);
  
    app.use('/api/payment', router);
    };