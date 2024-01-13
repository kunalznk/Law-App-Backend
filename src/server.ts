require("dotenv").config()
import express, { Request, Response } from "express"
import mongoose, { connect } from "mongoose";

import cors from "cors"

import mongo from "./config/db"
import lawRoute from './routes/lawRoutes';
import factsRoute from './routes/factRoutes';
import lawyerRoute from './routes/lawyerRoute';
import userRoute from './routes/userRoute';
import insertLawsFromFolder from "./utils/DataAdd";
import mongoUrl from "./config/db";

const app = express();
app.use(cors({
    origin:"*"
}))


app.use(express.json());
app.use("/api/law" , lawRoute);
app.use("/api/fact" , factsRoute);
app.use("/api/lawyer" , lawyerRoute);
app.use("/api/user" , userRoute);


app.get("/test" , (_req: Request, res: Response) => {
    insertLawsFromFolder('/home/Kunal.Zanke/temp/Data')
    res.status(200).json("Server is Running")
});

app.listen(+process.env.HTTP_PORT! , () => {
    console.log("Servier is listening on port ", +process.env.HTTP_PORT!)
})

async function run ()  {
    try {
        console.log("Starting Connection");
        await mongoose.connect(
            mongoUrl, {
                dbName: process.env.DATABASE
            }
        )
    } catch (error) {
        console.log("Cant connect due to", error)
    }
}

run()