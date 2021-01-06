//index.js yha bhejega users wale paths ko handle krne k liye

const express=require('express');

const router=express.Router();

router.get('/',(req,res)=>{
    res.send('mai user hu bhai');
})



module.exports=router;