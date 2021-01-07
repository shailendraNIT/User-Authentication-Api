const User=require('../models/user');
const {sendEmail}=require('../utils/sendmail');

// @route GET admin/user
// @desc Returns all users
// @access Public
exports.index=async function(req,res){

    const users=await User.find({});
    res.status(200).json({users});

}



// @route GET api/user/{id}
// @desc Returns a specific user
// @access Public
exports.show=async function(req,res){
    try{
        const id=req.params.id;
        const user=await User.findById(id);

        if(!user){
            return res.status(401).json({message:"User does not exist"});

        }

        res.status(200).json({user});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}


// @route PUT api/user/{id}
// @desc Update user details
// @access Public
exports.update=async function(req,res){
    try{
        const update=req.body;
        const id=req.params.id;
        const userId=req.user._id;

        //Make sure the passed id is that of the logged in user
        if(userId.toString()!=id.toString){
            return res.status(401).json({messsage:"Sorry,you don't have the permision to update this data"});
        }


        const user=await User.findByIdAndUpdate(id,{$set:update},{new:true});


        //if there is no image, return success message
        if (!req.file)
        return res.status(200).json({ user, message: "User has been updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// @route DESTROY api/user/{id}
// @desc Delete User
// @access Public
exports.destroy=async function(req,res){
    try{
        const id=req.params.id;
        const user_id=req.user._id;

        //Make sure the passed id is that of logged in user

        if(user_id.toString()!=id.toString()){
            return res.status(401).json({message:"Sorry,you don't have the permission to delete this data."});
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({message:"User has been deleted"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}