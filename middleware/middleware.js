const jwt = require('jsonwebtoken');
const User = require('../model/authModel');
const secretKey = 'my_secret_key';
    exports.authMiddleware = (req, res, next) => {
    if(req.headers && req.headers.token){
        const decoded = jwt.verify(req.headers.token,secretKey)
        req.email = decoded.email
        req.userId = decoded.userId
        console.log("=====>User id:", decoded.userId);
        console.log("=====>Email" , decoded.email)
        console.log("decoded =====>",decoded)
        next();
    }else {
        res.status(400).json({
            message:"user is not authenticate"  
        })
    }
    
    }
  