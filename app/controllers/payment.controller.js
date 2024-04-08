const dbConfig = require("../config/db.config");
const axios = require('axios');

const MongoClient = require("mongodb").MongoClient;

exports.createPayment = async (req, res) =>{
    try {
        // Use req.body to get necessary payment details
        const paymentDetails = req.body;
    
        // Call Paymongo API to create payment
        const paymongoResponse = await axios.post('https://api.paymongo.com/v1/payments', {
          data: {
            attributes: {
              amount: paymentDetails.amount,
              payment_method: {
                type: 'card',
                details: {
                  card_number: paymentDetails.cardNumber,
                  exp_month: paymentDetails.expMonth,
                  exp_year: paymentDetails.expYear,
                  cvc: paymentDetails.cvc
                }
              },
              currency: paymentDetails.currency,
              description: paymentDetails.description
            }
          }
        }, {
          headers: {
            Authorization: `Basic ${Buffer.from(dbConfig.PAYMONGO_SECRET).toString('base64')}`
          }
        });
    
        // Save payment information to MongoDB
        const newPayment = new Payment({
          paymentId: paymongoResponse.data.data.id,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          description: paymentDetails.description,
          cardNumber: paymentDetails.cardNumber,
          expMonth: paymentDetails.expMonth,
          expYear: paymentDetails.expYear
        });
    
        await newPayment.save();
    
        res.status(200).json({ success: true, data: paymongoResponse.data.data });
    
      } catch (error) {
        console.error('Error creating payment:', error.message);
        res.status(500).json({ success: false, error: error.message });
      }
}