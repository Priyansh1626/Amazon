const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/Ecommerce";
// const mongoURI = process.env.DB_CONNECT;

const connectToMongo = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true
    }, () => {
        console.log("connected to DB");
    })
}

connectToMongo();