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
const VideoRoter=require('./routes/videoRoutes');
const cron = require("node-cron");
const axios=require('axios');
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
app.use('/api/video',VideoRoter);
cron.schedule("*/3 * * * * ", async () => {
    try {
      const currentTime = new Date();
      console.log(`Current time: ${currentTime}`);
      
      const response = await axios.get('https://project-001-1.onrender.com/home');
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error fetching API:', error);
    }
  });

//start server
app.listen(process.env.PORT ,()=>{
    console.log('server is running on 4000')
})