const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const newUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [3, "Name must contain 3 letters"]
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email is already present"],
        validate(v) {
            if (!validator.isEmail(v)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        min: [5, "min length 5 required"]
    },
    phone: {
        type: Number,
        required: true,
        min: [10, "number must be of minimum 10 numbers"],
        unique: [true, "Phone number is already present"]
    },
    locality: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    orders: [{
        paymentId: {
            type: String
        },
        amount: {
            type: Number
        },
        order: {
            type: Array
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

newUserSchema.methods.generateAuthToken = async function () {
    try {
        const user = this
        const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY);
        user.tokens = user.tokens.concat({ token })
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

// securing password
newUserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const AmazonUser = new mongoose.model("AmazonUser", newUserSchema);

module.exports = AmazonUser;