const dbConfig = require("../config/db.config");
const db = require("../models");
const Payment = db.payment;
const Dorm = db.dormitory;
const axios = require('axios');

exports.createPayment = async (req, res) => {
    try {
        const paymentDetails = req.body;
        const dormId = paymentDetails.dorm_id;

        // Check if dormitory already has a payment_id
        const data = await Dorm.findById(dormId);
        if (data && data.payment_id) {
            return res.status(200).send({
                message: "Dorm already has a payment associated with it.",
                data

            });
        }

        const options = {
            method: 'POST',
            url: 'https://api.paymongo.com/v1/links',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Basic c2tfdGVzdF9COFM3a3BoWEJlRkJwZnk4ZnZvVWZSaVU6'
            },
            data: {
                data: {
                    attributes: {
                        amount: 10000, // Assuming amount in cents (PHP 100)
                        description: 'test'
                    }
                }
            }
        };

        axios.request(options)
            .then(async function (response) {
                const newPaymentData = {
                    payment_id: response.data.data.id,
                    payment_status: response.data.data.attributes.status,
                    payment_checkout_url: response.data.data.attributes.checkout_url,
                    payment_reference_number: response.data.data.attributes.reference_number,
                };

                // Update Dorm document with payment details
                await Dorm.findByIdAndUpdate(dormId, newPaymentData, { useFindAndModify: false });

                const payment = new Payment({
                    amount: 10000,
                    payment_id: response.data.id,
                    type: response.data.type,
                    checkout_url: response.data.data.attributes.checkout_url,
                    status: response.data.data.attributes.status,
                    user_id: paymentDetails.user_id,
                    dorm_id: paymentDetails.dorm_id,
                });

                payment.save(payment)
                    .then((data) => {
                        res.send({
                            message: "Payment was created successfully.",
                            data
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({
                            message: "Some error occurred while creating the Payment.",
                            error: err.message
                        });
                    });
            })
            .catch(function (error) {
                console.error(error);
                res.status(500).send({
                    message: "Error creating payment link."
                });
            });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal server error."
        });
    }
};

exports.getPayment = async (req, res) => {
    const reference_number = req.params.reference_number;
    const url = `https://api.paymongo.com/v1/links/${reference_number}`;
    const options = {
        method: 'GET',
        url: url,
        headers: {
          accept: 'application/json',
          authorization: 'Basic c2tfdGVzdF9COFM3a3BoWEJlRkJwZnk4ZnZvVWZSaVU6'
        }
      };
      
      axios
        .request(options)
        .then(function (response) {
            res.send({
                message: "Payment was retrieved successfully.",
                data: response.data,
            });
        })
        .catch(function (error) {
            res.status(500).send({
                message: error.message
            });
        });
}

exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Payment information to update can not be empty!"
      });
    }
    const checkout_url = req.params.checkout_url;

    // Find the payment by checkout_url and update it with the provided data
    Payment.findOneAndUpdate({ checkout_url: checkout_url }, req.body, { useFindAndModify: false })
    .then(data => {
        if (!data) {
        res.status(404).send({
            message: `Cannot update Payment with checkout_url=${checkout_url}. Maybe Payment was not found!`
        });
        } else {
        res.send({ message: "Payment was updated successfully." });
        }
    })
    .catch(err => {
        res.status(500).send({
        message: "Error updating Payment with checkout_url=" + checkout_url
        });
    });

  };

