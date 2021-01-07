const User=require('../models/user')
const sendEmail=require('../utils/sendmail')

exports.recover=async (req,res)=>{
    try{
        const {email}=req.body;
        const user= await User.findOne({email});

        if(!user){
            req.flash('error',`The email address ${req.body.email} is not associated with any account.Double check your email address ans try again`);

            return res.redirect('/api/auth/recover');
        }

        user.generatePasswordReset();

        await user.save();

        let subject="Password change request";
        let to=user.email;
        let from=process.env.FROM_EMAIL;
        let link=`http://${req.headers.host}/api/auth/reset/user.resetPasswordToken`;
        let html=`<p>Hi ${user.username}</p>
        <p>Please click on the following <a href="${link}">link</a> to reset your password.</p> 
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

        await sendEmail({to,from,subject,html});

        req.flash('info',`The Email has been sent to ${req.body.email}. Kindly reset your password from there`);

        return res.redirect('/api/auth/recover');

    }
    catch(err){
        req.flash('error','There is some server side error');

        return res.redirect('/api/auth/recover');
    }
}


exports.reset=async (req,res)=>{
    try{
        const {token}=req.params;
        const user= await User.findOne({resetPasswordToken:token,resetPasswordExpires:{$gt:Date.now()}});

        if(!user){
            req.flash('error','Password reset token is invalid or has expired.');

            return res.redirect('/api/auth/recover');

        }

        res.render('reset',{user:user});
        
    }
    catch(err){
        res.status(500).json({message:error.message});
    }
};



exports.resetPassword=async (req,res)=>{
    try{
        const {token}=req.params;

        const user=await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpires:{$gt:Date.now()}
        })

        if(!user){
            req.flash('error','Password reset token is invalid or has expired');

            return res.status(401).redirect('/api/auth/recover');
        }


        user.password=req.body.password;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpires=undefined;
        user.isVerified=true;


        await user.save();
        let subject = "Your password has been changed";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let html = `<p>Hi ${user.username}</p>
                        <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`;
    
        await sendEmail({ to, from, subject, html });
    
        req.flash("success", "Your password han been updated");
        return res.redirect("/api/auth/login");
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}