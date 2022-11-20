const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: true,
        unique: [true, "Img must be unique so that products can be identified"]
    },
    rating: {
        type: Number,
        required: true,
        max: [5, "cannot exceed 5 stars"]
    },
    category: {
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const AmazonProduct = new mongoose.model("AmazonProduct", productSchema);

module.exports = AmazonProduct;