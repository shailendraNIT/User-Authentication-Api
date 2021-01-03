require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const passport = require('passport');


console.log('8');


const port=process.env.PORT || 3000;
const connUri=process.env.MONGO_LOCAL_CONN_URL ;

const app=express();




app.use(express.json()); //parsing application/json
app.use(express.urlencoded({extended:false})); //parsing application/xwww

console.log('22');

app.set('view engine','pug');


//database connection

//mongoose.promise=global.promise  only  useful in mongoose verson 4
mongoose.connect(connUri,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true})

mongoose.connection.once('open',()=>{
    console.log(`MongoDB --database connection established successfully`)
})
mongoose.connection.on('error',(err)=>{
    console.log(`MongoDB connection error.Please make sure MongoDB is running. ${err}`);
    process.exit();
})



app.get('/',(req,res)=>{
    res.status(200).render('homepage',{title:'My page',message:'this is message'});
})


app.use(passport.initialize());
require('./middlewares/jwt')(passport);


console.log('51');
require('./routes/index')(app);


app.listen(port,()=>{
    console.log(`server is up and running at port: ${port}`)
});