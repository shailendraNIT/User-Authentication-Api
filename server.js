require('dotenv').config();
const express=require('express');
const routes=require('./routes/index') //index jake sbko route krega auth ko b aur user endpoint ko b
const mongoose=require('mongoose');
const passport = require('passport');
var session = require("express-session");
var cookieParser = require("cookie-parser");
var flash        = require('express-flash')
const cors = require("cors");





const port=process.env.PORT || 3000;
const connUri=process.env.MONGO_LOCAL_CONN_URL ;




const app=express();

app.use(cors());




app.use(express.json()); //parsing application/json
app.use(express.urlencoded({extended:false})); //parsing application/xwww

app.use(flash());
app.use(cookieParser());



app.use(
    session({
      secret: "secret key",
      resave: true,
      saveUninitialized: true,
    })
);



app.set('view engine','pug');


//database connection

//mongoose.promise=global.promise  only  useful in mongoose verson 4

async function connectdb(){
    await mongoose.connect(connUri,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:false});
}
connectdb();

mongoose.connection.once('open',()=>{
    console.log(`MongoDB --database connection established successfully`)
})
mongoose.connection.on('error',(err)=>{
    console.log(`MongoDB connection error.Please make sure MongoDB is running. ${err}`);
    process.exit();
})



app.get('/',(req,res)=>{
    res.status(200).render('homepage',{title:'My page',message:'This is website homepge'});
})


app.use(passport.initialize());
require('./middlewares/jwt')(passport);



routes(app);


app.listen(port,()=>{
    console.log(`server is up and running at port: ${port}`)
});