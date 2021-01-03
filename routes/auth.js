//request comes from index.js so first read index.js

const express=require('express');


const router=express.Router();


router.get('/',(req,res)=>{
    res.status(200).render('layout',{title:'Homepage',user:req.user});
})


router.get('/login',(req,res)=>{
    res.status(200).render('login',{user:req.user});
})

router.get('/register',(req,res)=>{
    res.status(200).render('signup',{user:req.user});
})
router.get('/recover',(req,res)=>{
    res.status(200).render('forgot',{user:req.user});
})
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('api/auth');
})
router.get('/resend',(req,res)=>{
    res.render('verify',{user:req.user});
})












module.exports=router;