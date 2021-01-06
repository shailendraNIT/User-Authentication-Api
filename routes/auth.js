//request comes from index.js so first read index.js

const express=require('express');
const {check}=require('express-validator');
const validate=require('../middlewares/validate'); //middleware function
const Auth=require('../controllers/Auth');
const Password = require("../controllers/password");


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

router.post('/register',[
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().isLength({min:6}).withMessage('Must be atleast 6 chars long'),
    check('firstName').not().isEmpty().withMessage('Your first name is required'),
    check('lastName').not().isEmpty().withMessage('Your last name is required')
],
validate,Auth.register);


router.post('/login',[check('email').isEmail().withMessage('Enter a valid email address'),check('password').not().isEmpty()],validate,Auth.login);

//EMAIL Verification

//http://127.0.0.1:3000/api/auth/verify/d12d5843e6f1f1496e453115c0c12fbef3ff416a
// register krke apne aap jo email pe link jata hai..vo yahi hai and last wala part token id hai
router.get("/verify/:token", Auth.verify);
router.post("/resend", Auth.resendToken);



//Password RESET
//127.0.0.1:3000/api/auth/recover  "POST"  -> for below code to run
//isse given mail pe reset password ka link ayega
router.post(
    "/recover",
    [check("email").isEmail().withMessage("Enter a valid email address")],
    validate,
    Password.recover
  );
  
  //ye jb email pe link ayega to link ko click krne pe yahi url khulega..as khol rhe hai to get
  router.get("/reset/:token", Password.reset);
  
  //jb change password pe click krenge to "POST" request hogi
  router.post(
    "/reset/:token",
    [
      check("password")
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage("Must be at least 6 chars long"),
      check("confirmPassword", "Passwords do not match").custom(
        (value, { req }) => value === req.body.password
      ),
    ],
    validate,
    Password.resetPassword
);


module.exports=router;