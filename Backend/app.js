const dotenv=require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const express=require('express');
const cors=require('cors');
const app=express();
const CookieParser=require('cookie-parser');
const conncetToDb=require('./db/db');
const userRoutes=require('./routes/user.routes');
const captainRoutes=require('./routes/captain.routes');

conncetToDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(CookieParser());


app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.use('/users',userRoutes);
app.use('/captains',captainRoutes);

module.exports=app;     