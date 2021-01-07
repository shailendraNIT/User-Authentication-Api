//index.js yha bhejega users wale paths ko handle krne k liye

const express=require('express');
const {check}=require('express-validator');
const User=require('../controllers/user');
const validate=require('../middlewares/validate');

const router=express.Router();


//INDEX
router.get('/',User.index);

//SHOW
router.get('/:id',User.show);

//UPDATE
router.put('/:id',User.update);

//DELETE
router.delete('/:id',User.destroy);


module.exports=router;