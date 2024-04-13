const bodyParser = require('body-parser');

module.exports = app => {
    const payment = require("../controllers/payment.controller.js");
  
    var router = require("express").Router();
    app.use(bodyParser.json());
  
    // Retrieve all Dormitory
    router.post("/create-payment", payment.createPayment);
  
    app.use('/api/payment', router);
    };