import jwt from 'jsonwebtoken' ;
import User from "../models/user.model.js";
export const checkAuth = async (req,res,next) => {
    console.log("i am in checkAuth") ; 
     try {
    
        const token = req.cookies.jwt  ;
        if(!token) {
        res.status(401).json({error : 'Not authenticated'}) ;
        return ;
        } 



    const decoded = jwt.verify(token,process.env.SECRET) ; 
    if(!decoded) {
        res.status(401).json({error : 'Not authenticated'}) ;
        return ;  
    }
    const id = decoded.id;
    const user = await User.findById(id).select('-password');
    if(user) {
        req.user = user ; 
        next();
    }else {
        throw new Error('Not authenticated') ;
    }


    }catch(err) {
        console.error(err) ;
        res.status(401).json({error : 'Not authenticated'}) ;
        return ;
 
    }

    
 }