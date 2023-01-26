const mongoose = require('mongoose');
// const AmazonProduct = require("../modals/products");
// const mongoURI = "mongodb://127.0.0.1:27017/ecommerce";
require("dotenv").config();
const mongoURI = process.env.DB_CONNECT;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("connected to DB");
        }
    }
)