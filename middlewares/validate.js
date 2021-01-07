const {validationResult}=require('express-validator');

module.exports=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        let error={};
        errors.array().map((err)=>error[err.param]=err.msg);

        req.flash('error',`${JSON.stringify(error)}`);

        return res.status(422).redirect('back');
    }

    else next();

}

//example of errors
// {
//     "errors": [
//       {
//         "location": "body",
//         "msg": "Invalid value",
//         "param": "username"
//       }
//     ]
//  }