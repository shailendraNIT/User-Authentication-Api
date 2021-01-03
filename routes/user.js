//index.js yha bhejega users wale paths ko handle krne k liye

const express=require('express');

const router=express.Router();

router.get('/',(req,res)=>{
    res.send('mai user hu bhai');
})

console.log('user 10')

module.exports=router;