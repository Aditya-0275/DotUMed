// require("dotenv").config({path: "./.env"});
import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { app } from "./app.js";

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`);
        })
    })
    .catch((error) => {
        console.error("Error: MONGODB connection failed, ", error);
        throw error;
    })



















/*
import express from "express";  

const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Connected to MongoDB");
        app.on("error", (error) => {
            console.error("Error: ", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
})()

*/
