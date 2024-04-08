module.exports = app => {
    const payment = require("../controllers/payment.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Dormitory
    router.post("/create-payment", payment.createPayment);
  

    };