const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const AmazonUser = require("../modals/newUser");
const stripe = require("stripe")("sk_test_51M5AaMSDw0brp7tFH3gYpHAigumglzzGjjZ7FcBvjxH8iH3UEaGTEBp6Gngwy50uoqEA5x1hhFJgpdYJ76ME6cBg003LMBzxNi");

router.post("/checkout/payment/create", async (req, res) => {
    const total = req.query.total;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "inr",
    });

    res.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})

router.post("/orderstored", auth, async (req, res) => {
    const user = req.user;
    const { id, basket, amount } = req.body;
    try {
        AmazonUser.findOne({ email: user.email }, async (err, user) => {
            if (user) {
                user.orders = user.orders.concat({ paymentId: id, order: basket, amount: amount });
                const myOrder = await user.save();
                res.send({ message: "order stored successfully" }).status(201);
            }
            else {
                res.send({ message: `order not stored , ${err}` }).status(401);
            }
        })
    } catch (e) {
        res.send({ message: `order not stored , ${e}` }).status(401);
    }
})

router.get("/getorders", auth, async (req, res) => {
    const user = req.user;
    try {
        AmazonUser.findOne({ email: user.email }, async (err, user) => {
            if (user) {
                res.send({ orders: user.orders }).status(201);
            }
            else {
                res.send({ message: err }).status(201);
            }
        })
    } catch (e) {
        res.send({ message: `no user found` }).status(401);
    }
})

module.exports = router;
