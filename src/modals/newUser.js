const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema({
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
        type: String,
        required: true,
        min: [10, "number must be of minimum 10 numbers"],
        unique: [true, "Phone number is already present"]
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    address: [
        {
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
        }
    ],
    tokens: [{
        token: {
            type: String,
        },
        date: {
            type: String,
            default: function () {
                const timeElapsed = Date.now()
                const today = new Date(timeElapsed);
                return today.toUTCString();
            }
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
            type: String,
            default: function () {
                const timeElapsed = Date.now()
                const today = new Date(timeElapsed);
                return today.toUTCString();
            }
        }
    }],
    seller: {
        Sname: {
            type: String
        },
        Semail: {
            type: String
        },
        Sphone: {
            type: Number
        },
        Sadhar: {
            type: String,
        },
        Saddress: {
            locality: {
                type: String
            },
            city: {
                type: String
            },
            state: {
                type: String
            }
        },
        Sproducts: [
            {
                id: {
                    type: Number,
                },
                title: {
                    type: String
                },
                price: {
                    type: Number
                },
                img: {
                    type: String
                },
                rating: {
                    type: Number
                },
                category: {
                    type: String
                }
            }
        ]
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

userSchema.methods.generateAuthToken = async function () {
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
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const AmazonUser = new mongoose.model("AmazonUser", userSchema);

module.exports = AmazonUser;