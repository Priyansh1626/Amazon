const express = require("express");
const auth = require("../middleware/auth");
const AmazonUser = require("../modals/newUser");
const AmazonProduct = require("../modals/products");
const router = new express.Router();

router.post("/api/newproduct", auth, async (req, res) => {
    const user = req.user;
    try {
        const product = new AmazonProduct(req.body);
        const createProduct = await product.save();
        res.send({ product: createProduct, user: user }).status(201);
    } catch (error) {
        res.send(error).status(400);
    }
});

router.get("/api/getallproducts", async (req, res) => {
    try {
        const allProducts = await AmazonProduct.find();
        res.send({ allproducts: allProducts }).status(201);
    } catch (error) {
        res.send(error).status(401);
    }
});

router.post("/api/getproductwithid", auth, async (req, res) => {
    try {
        // console.log(req.body);
        const product = await AmazonProduct.findOne({ id: req.body.id })
        if (product) {
            // console.log(product);
            res.send({ product: product }).status(201);
        }
        else {
            res.send({ message: "cannot find the details" })
        }
    } catch (error) {
        res.send(error).status(401);
    }
});

router.post("/api/getsubcategory", async (req, res) => {
    try {
        const items = await AmazonProduct.find({ category: req.body.category });

        const subCategory = [...new Set(items.map((elm) => {
            return (elm.subCategory);
        }))];
        res.send({ subCategory: subCategory, category: req.body.category }).status(200);

    } catch (error) {
        console.log(error);
    }
})

router.patch("/api/sellerdetails", auth, async (req, res) => {
    const { name, email, phone, adhar, locality, city, state, isSeller } = req.body;
    const user = req.user;
    try {
        const updatedUser = await AmazonUser.findByIdAndUpdate(user._id,
            {
                isSeller: isSeller,
                seller: {
                    Sname: name,
                    Semail: email,
                    Sphone: phone,
                    Sadhar: adhar,
                    Saddress: {
                        locality: locality,
                        city: city,
                        state, state
                    },
                }
            },
            {
                new: true
            }
        );
        res.send({ user: updatedUser }).status(201);
    } catch (error) {
        res.send({ message: error }).status(401);
    }
});

router.post("/api/sellerproducttosell", auth, async (req, res) => {
    const { title, price, img, rating, category, id, subCategory } = req.body;
    const user = req.user;
    try {
        AmazonUser.findOne({ email: user.email }, async (err, user) => {
            if (user) {
                user.seller.Sproducts = user.seller.Sproducts.concat({ id: id, title: title, price: price, img: img, rating: rating, category: category, subCategory: subCategory });

                const myProduct = await user.save();
                res.send({ user: user }).status(201);
            }
            else {
                res.send({ message: "cannot store product in DB" }).status(401);
            }
        })
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;