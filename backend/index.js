import express from "express";
import {PORT,mongoDBURL} from "./config.js";
import mongoose from 'mongoose'
import {Book} from './models/bookModel.js';


const app=express();

app.get('/',(request,response)=>{
    console.log(request);
    return response.status(234).send('Welcome to MERN stack tutorial');
});



mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log("App conencted to database");
        app.listen(PORT,()=>{
            console.log(`App is listening to the port: ${PORT}`);
        })
    })
    .catch((error)=>{
        console.log(error)
    });