const express = require("express");
const AmazonProduct = require("../modals/products");
const router = new express.Router();

router.post("/api/newproduct", async (req, res) => {
    try {
        const product = new AmazonProduct(req.body);
        const createProduct = await product.save();
        res.send(createProduct).status(201);
    } catch (error) {
        res.send(error).status(400);
    }
})

router.get("/api/getallproducts", async (req, res) => {
    try {
        const allProducts = await AmazonProduct.find();
        res.send(allProducts);
    } catch (error) {
        res.send(error).status(401);
    }
})

module.exports = router;