require('dotenv').config()
import mongoose from "mongoose";

const { DB_URL, DATABASE } = process.env
const mongoUrl =   DB_URL

mongoose.set('strictQuery', true);

const mongo = mongoose.connect(
        mongoUrl!   
    , {
    autoIndex: false,
    autoCreate: true,
    dbName: DATABASE,
}, () => {
    console.log("MongoDB connected")
});


export default mongoUrl
