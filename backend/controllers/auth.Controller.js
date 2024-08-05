import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import {generateTokenAndSetCookie} from "../lib/utils/generateToken.js";

export const signUp = async (req,res) => {
    try {
    console.log('signUpController') ;
    const {fullName,username,email,password,gender} = req.body ;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    /*emailRegex.test(email) ; */ 
    if(!email.match(emailRegex)) {
        res.status(400).json({error : 'please enter a valid email address'}) ; 
        return ; 
    }

    if(password.length < 6 ) {
        console.log('Please enter a valid password > 6') ; 
       return  res.json({error : 'password must be at least 6 characters long'}) ; 
        
    }
    const existingUsername = await User.findOne({username}) ; 
    if(existingUsername) {
       return res.json({error : 'username already exists'}) ; 
        
    }
    const existingUserEmail = await User.findOne({email}) ; 
    if(existingUserEmail) {
       return res.json({error : 'email already exists'}) ;  
        
    }
    
    const hashPassword = bcrypt.hashSync(password,8) ;
    const user = new User({
        fullName,
        username,
        email,
        password: hashPassword,
        gender
    });
    
    if(user) {
        generateTokenAndSetCookie(user._id,res) ;
        await user.save() ;
        res.status(201).json({
            message: 'User created successfully',
            user
        })
    }else {
        console.log("else") ; 
       return res.json({error : 'Failed to create user'}) ;
        
    }
    }catch(e) {
        res.json({error : e.message}) ; 
    }



   
}

export const signIn = async (req,res) => {
    try {
    const {email , password} = req.body
    console.log(email) ; 
    if(!email || !password) {
       return res.json({error : 'Please provide email and password'}) ;
        
    }
    const user = await User.findOne({email}) ; 
    if(!user) {
        return res.json({error : 'User not found'}) ; 
    }
    const passwordUser = user?.password ;
    const validPassword =  await bcrypt.compareSync(password,passwordUser) ;
    if(!user || !validPassword) {
        console.log(user) ; 
       return res.status(200).json({error : 'Invalid email or password'}) ;
        
    }
    generateTokenAndSetCookie(user._id,res) ;
    res.json({
        message: 'User logged in successfully',
        user
    })
    }
    catch(error) {
        console.log(error) ;
        res.status(200).json({error : 'Server Error'}) ;
    
 
    }


 }

export const getMe = async (req, res) => {
  try {
    // Retrieve the user from the database using the ID from the request object
    const user = await User.findById(req.user._id).select('-password');
    // If the user is found, send a response with the user data
    if (user) {
      return res.json({ message: "User found", user : user });
    } else {
      return res.json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.json({ error: "Server error" });
  }
};


export const logOut = (req,res) => {
    try {
        res.clearCookie("jwt") ; 
    res.json({message : 'Logged out successfully'}) ;
    }catch(err) {
        console.log(err)  ; 
         res.status(200).json({error : "server error"}) ; 
    }
    
    
}