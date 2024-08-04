import bcrypt from 'bcryptjs' ;
import {v2 as cloudinary} from 'cloudinary' ; 

import User from "../models/user.model.js";
import notifications from "../models/notification.model.js";


export const getUserProfile = async (req,res) => {
    try {
    
    const {username} = req.params; 
    console.log(username) ; 
    const user = await User.findOne({username}).select("-password")  ;
    
    if(!user) {
        return res.status(404).json({error : 'User not found'}) ; 
    }else {
        res.status(200).json({success : user }) ;
    }


    }catch(err) {
        console.log(err.message) ; 
    }}


export const followUnfollowUser = async (req,res) => {
    try {
        let currentUser = req.user ; 
        let targetUser = await User.findById(req.params.id) ; 
        
        if(currentUser._id === targetUser._id) {
            return res.status(400).json({error : 'Cannot follow yourself'}) ;  // preventing a user from following themselves
        }
        if(!currentUser ||!targetUser) {
            return res.status(404).json({error : 'User not found'}) ;
        }
        
        if(currentUser.following.includes(targetUser._id)) { 
            currentUser.following.remove(targetUser._id) ;
            targetUser.followers.remove(currentUser._id) ;
            await currentUser.save() ;
            await targetUser.save() ;
            res.status(200).json({message : "Success", targetUser : targetUser , currentUser : currentUser}) ; 
            const newNotification = new notifications({
                from : currentUser._id,
                to : targetUser._id,
                type : 'unfollow',
                user : targetUser._id,
            });
            await newNotification.save() ;
            return res.json({message : `${currentUser.username} unfollowed ${targetUser.username}`, targetUser : targetUser , currentUser : currentUser , notification : newNotification}) ;    
        
        }

        else {
        
        
        currentUser.following.push(targetUser._id) ;
        targetUser.followers.push(currentUser._id) ;
        await currentUser.save() ;
        await targetUser.save() ;  // saving both users to update their followers count  ;  // in real-world scenario, you might want to use a background job for this to improve performance  ;  // also, you might want to add some checks to prevent duplicate followings  ;  // also, you might want to add some checks to prevent users from following too many people or getting too many followers  ;  // also, you might want to add some checks to
        
        const newNotification = new notifications({
            from : currentUser._id , 
            to : targetUser._id,
            type : 'follow',
            user : targetUser._id,
        });

        await newNotification.save() ;
        res.json({message : `${currentUser.username} has followed ${targetUser.username}`, targetUser : targetUser , currentUser : currentUser , notification : newNotification}) ; 
        }
        
    }catch(err) {
        console.log(err.message) ;
    }
}

export const getUsers = async (req,res) => {
    try {
        const users = await User.find().select('-password') ;
        res.status(200).json({success : users }) ;
    }catch(err) {
        console.log(err.message) ;
        res.send(err.message) ;
    }


}

export const suggestUsers = async (req,res) => {
   try {
    const userId = req.user._id  ; 
    const usersFollowedByMe = await User.findById(userId).select("following") ; 

    const users = await User.aggregate([
        {
            $match : {
                _id : { $ne : userId}
            }
        },
        {
            $sample : { size : 10 }
        }
    ]);

    const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id)) ; 
    const suggestUsers = filteredUsers.slice(0,4) ; 

    suggestUsers.map((user) => (user.password = null)) ; 
    res.json(suggestUsers) ; 

   }
    

    
    catch(err) {
        console.log(err.message) ;
        res.json({error : err.message}) ; 
     }
}

export const UpdateUser = async (req,res) => {
    try {
        const {fullName,email,username,currentPassword,newPassword,bio,link} = req.body ;
        let {profileImg,coverImg} = req.body  ; 

        let user = await User.findById(req.user._id) ;

        if(!user) {
            return res.status(401).json({error : "user Not Found"}) ; 

        }
        
        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({error : "Please provide current password or new password"}) ;
        }

        if(currentPassword && newPassword) {
            console.log(user) ; 

            const isMatch = bcrypt.compareSync(currentPassword,user.password); 
            if(!isMatch) {
                return res.status(401).json({error : "Current password is incorrect"}) ;
            
            }
            if(newPassword.length < 6  ) {
                return res.status(400).json({error : "Password must be at least 6 characters long"}) ;
            }
            
            
            user.password = await bcrypt.hash(newPassword,10) ;
            
            
        }

        if(profileImg) {
            if(user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]) ;  // deleting the old profile image from cloudinary  // in a real-world scenario, you might want to add some checks to prevent users from deleting their own profile images  // also, you might want to add some checks to prevent users from deleting their own profile images  // also, you might want to add some checks to prevent users from deleting their own profile images  // also, you might want to add some checks to prevent users from deleting their own profile images  // also, you might want to add some checks to prevent users from deleting their own profile images  // also, you might want to add some checks to prevent users from deleting their own profile images  // also, you might want to add some checks to prevent users from deleting their own profile images  // also, you might want to add some checks to prevent users from deleting their own profile images  // also, you might want to add some checks
            }
           const uploadedResponse =  await cloudinary.uploader.upload(profileImg) ; 
            profileImg = uploadedResponse.secure_url ; 
        }
        
        if(coverImg) {
            if(user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]) ;  // deleting the old cover image from cloudinary  // in a real-world scenario, you might want to add some checks to prevent users from deleting their own cover images  // also, you might want to add some checks to prevent users from deleting their own cover images  // also, you might want to add some checks to
            const uploadedResponse =  await cloudinary.uploader.upload(coverImg) ; 
            coverImg = uploadedResponse.secure_url ;
        }

    }
        if(username) {
            const search = await User.findOne({username}) ; 
            if(search){
                return res.status(400).json({error : "username already exists"}) ;
            }else {
                user.username = username ;
            }
        }
        if(email) {
            const search = await User.findOne({email}) ; 
            if(search) {
                return res.status(400).json({error : "Email already exists"}) ;
            }
            user.email = email ;
        }
        user.fullName = fullName || user.fullName ;
        user.bio = bio || user.bio ;
        user.link = link || user.link ;
        user.profileImg = profileImg || user.profileImg ;
        console.log(user.profileImg) ; 
        console.log("coverImg Backend") ; 
        user.coverImg = coverImg || user.coverImg ;
        console.log(coverImg) ;

        user = await user.save() ; 

        user.password = null ; 

        return res.status(200).json(user) ; 
 
    }catch(err) {
    console.log(err) ;
    res.status(500).json({error : err.message}) ; 

    }

}



export const getUsersForSideBar = async (req,res) => {
    try {
        const user = req.user ; 
    const currentUserFollowing = await  User.findById({_id : user._id}).select('following').populate('following',['username','profileImg']) ;
       return res.json(currentUserFollowing) ;
    }catch(err) {
        console.log(err.message) ; 
      return  res.json({error : err.message}) ; 
    }
    

}

export const deleteUser = async (req,res) => {
    try {
        const user = await User.deleteMany({}) ;
        res.status(200).json({message : "All users deleted"}) ; 
        }catch(err) {
            console.log(err.message) ;
            return res.status(500).json({error : err.message}) ;
        }

}