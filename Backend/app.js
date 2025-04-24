const dotenv=require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const express=require('express');
const cors=require('cors');
const app=express();
const conncetToDb=require('./db/db');
conncetToDb();
app.use(cors());



app.get('/',(req,res)=>{
    res.send('Hello World!');
}
);

module.exports=app;     