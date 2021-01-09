const User = require('../models/user')
const token = require('../models/token')
const sendEmail = require('../utils/sendmail');



//route POST api/auth/register k liye work krega
exports.register = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            req.flash('error', 'The entered email address is already associated with another account');

            return res.redirect('/api/auth/register');
        }

        const newUser = new User({ ...req.body, role: 'basic' }) //role based access -control
        console.log('21');
        const user_ = await newUser.save(function(err,news){
            if(err)console.log('err',err);
            if(news)console.log('news',news);
            
        });
        console.log('23');


        await sendVerificationEmail(user_, req, res);
        console.log('27');
    } catch (error) {
        req.flash('error', `${JSON.stringify(error)}`);

        return res.redirect('/api/auth/register');
    }
}

//routes POST api/auth/login k liye work krega

exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});

        if(!user){
            req.flash('error',"User doesn't exists.Please register first");

            return res.status(401).redirect('/api/auth/login');
        }

        //User found in db now validating password
        if(!user.comparePassword(password)){
            req.flash('error',"Invalid email or password");

            return res.status(401).redirect('/api/auth/login');
        }

        //Making sure if the user is verified
        if(!user.isVerified){
            req.flash('error','please verify your email first');

            return res.status(401).redirect('/api/auth/login');
        }

        res.status(200).json({token:user.generateJWT(),user:user});
        

    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}

//=== email verification
//routes GET api/verify/:token
exports.verify=async(req,res)=>{
    if(!req.params.token){
        req.flash('error','We are unable to find a user for this token');
        return res.status(400).redirect('back');
    }

    try{

        const token=await token.findOne({token:req.params.token});

        if(!token){
            req.flash('error','We are unable to find a valid token.Your token may have expired');
            return res.status(400).redirect('back');
        }

        User.findOne({_id:token.userId},(err,user)=>{
            if(!user){
                req.flash('error','we are unable to find a user for this token');
                return res.status(400).redirect('back');
            }

            if(user.isVerified){
                req.flash('error','This user has already been verified')
                
                return res.status(400).redirect('back');
            }

            user.isVerified=true;
            user.save(function(err){
                if(err)return res.status(500).json({message:err.message});

                req.flash("info",'Account has been verified.Please log in');

                return res.status(200).redirect('/api/auth/login');
            })
        })
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

// @route POST api/resend
// @desc Resend Verification Token
// @access Public
exports.resendToken = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        {
          req.flash(
            "error",
            "The email address " +
              req.body.email +
              " is not associated with any account. Double-check your email address and try again."
          );
          return res.redirect("/api/auth/resend");
        }
      }
  
      if (user.isVerified) {
        req.flash(
          "info",
          "This account has already been verified. Please log in."
        );
        return res.redirect("/api/auth/login");
      }
      console.log('sending email from Auth.js')
      await sendVerificationEmail(user, req, res);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: error.message });
    }
  };





async function sendVerificationEmail(user, req, res) {
    console.log('in sendverificationEmail');
    try {
        const token = user.generateVerificationToken();
        console.log('token generated');


        await token.save((err,news)=>{
            if(err)console.log(err);
            if(news)console.log(news);
        });


        let subject = "Account Verification Email";

        let to = user.email
        //let from = process.env.FROM_EMAIL;
        let user_name=user.username;

        let link = `http://${req.headers.host}api/auth/verify/${token.token}`;

        // let html = `<p>Hi ${user.username}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
        //           <br><p>If you did not request this, please ignore this email.</p>`;

        await sendEmail({user_name,link,to,});

        req.flash('info',"A verification email has been sent to " +
        user.email +
        ".Kindly verify your Email.");

        return res.redirect('/api/auth/register');
        
    }
    catch(err){
        console.log('error generated in sending mail',err);
        res.status(500).json({message:err});
    }
}