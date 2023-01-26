const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: [true, "All products must have a unique id"]
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
        unique: [true, "Img must be unique so that products can be identified"]
    },
    rating: {
        type: String,
        required: true,
        max: [5, "cannot exceed 5 stars"]
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        // required:true
    },
    qnt: {
        type: Number,
    },
    date: {
        type: String,
        default: function () {
            const timeElapsed = Date.now()
            const today = new Date(timeElapsed);
            return today.toUTCString();
        }
    }
});

const AmazonProduct = new mongoose.model("AmazonProduct", productSchema);

// const newP = new AmazonProduct({
//     id:"111",
//     title: "new2",
//     price: "4000",
//     img: "n.sf",
//     rating: "5",
//     category: "no"
//     subCategory:"etc"
// });

// newP.save();

module.exports = AmazonProduct;