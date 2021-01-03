//ye main route hai yha se baki k routes p jayenge

const auth=require('./auth');
const user=require('./user');

const authenticate = require("../middlewares/authenticate");



module.exports = (app)=>{

    

    //handles all api/auth paths
    app.use('/api/auth',auth);

    

    //handles all /api/user paths
    app.use("/api/user", authenticate, user);

    

}