import express from "express";
import {PORT,mongoDBURL} from "./config.js";
import mongoose from 'mongoose'
import {Book} from './models/bookModel.js';
import booksRoute from './routes/booksRoute.js'
import cors from 'cors';



const app=express();

app.use(express.json()) ;

//Middleware for handling CORS policy
//option 1: Allow all origins with default of cors(*) 
app.use(cors());

//option 2: Allow custom origins
// app.use(
//     cors({
//         origin:'http://localhost:3000',
//         methods:['GET','POST','PUT','DELETE'],
//         allowedHeaders:['Content-Type'],
//     })
// );


app.get('/',(request,response)=>{
    console.log(request);
    return response.status(234).send('Welcome to MERN stack tutorial');
});

app.use('/books',booksRoute);


//Route to save a new book
app.post('/books',async (request,response)=>{
    try{
        if(
            !request.body.title||
            !request.body.author||
            !request.body.publishYear
        ){
            return response.status(400).send({
            message:'Send all required fields: title, author, publishYear', 
        });

    }
    const newBook = {
        title:request.body.title,
        author:request.body.author,
        publishYear:request.body.publishYear,
    };

    const book = await Book.create(newBook);
    response.status(201).send(book);    

    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    };
});

//Route for Getting all Books
app.get('/books', async(request,response)=>{
    try{
        const books=await Book.find({});
        return response.status(200).json({
            count:books.length,
            data:books
        });
    }catch(error){
            console.log(error.message);
            response.status(500).send({message:error.message});
        }
});

//Route for Get one book
app.get('/books/:id', async(request,response)=>{
    try{
        const {id}=request.params;

        
        const book=await Book.findById(id);
        return response.status(200).json(book);
    }catch(error){
            console.log(error.message);
            response.status(500).send({message:error.message});
        }
});

//Route for updating book
app.put('/books/:id',async (request,response) =>{
    try {
        if(
            !request.body.title||
            !request.body.author||
            !request.body.publishYear
        ){
            return response.status(400).send({
                message:"Send all required fields: title,author,publishYear",
            });
        }
        const {id}=request.params;
        const result=await Book.findByIdAndUpdate(id, request.body);
        if(!result){
            return response.status(404).json({message: 'Book not found'});
        }
        return response.status(200).send({message: 'Book updated successfully'});
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//Route for deleting a book
app.delete('/books/:id',async (request,response)=>{
    try {
        const {id} = request.params;
        const result = await Book.findByIdAndDelete(id);

        if (!result){
            return response.status(404).json({message: "Book not found"});
        }
        return response.status(200).json({message:"Success"});
    } catch (error) {
        console.log(error);
        response.status(500).send({message:error.message});
    }
});

mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log("App connected to database");
        app.listen(PORT,()=>{
            console.log(`App is listening to the port: ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log(error);
    });