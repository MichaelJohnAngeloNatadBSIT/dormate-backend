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
        const existingDorm = await Dorm.findById(dormId);
        if (existingDorm && existingDorm.payment_id) {
            return res.status(400).send({
                message: "Dorm already has a payment associated with it."
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

                payment.save()
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

