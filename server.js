const express = require('express');
const bodyPerser=require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv').config();
const cors =require('cors');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const dbConnect =require('./config/dbConnect');
const Router=require('./routes/index');
const authRoter=require('./routes/authRoutes');
dbConnect();
const passport = require('passport');

require('./config/passport')(passport);

const app=express();


//router
app.use(cors());
app.use(morgan('dev'));
app.use(bodyPerser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Add session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRITE, // Replace with a secure key
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Session expires in 1 day
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(Router);
app.use('/api/auth',authRoter);

//start server
app.listen(process.env.PORT ,()=>{
    console.log('server is running on 4000')
})