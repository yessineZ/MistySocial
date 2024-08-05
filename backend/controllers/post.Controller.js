import {v2 as cloudinary} from 'cloudinary'  ;
import Post from '../models/post.model.js';
import notifications from '../models/notification.model.js';
import User from '../models/user.model.js';

export const createPost = async (req,res ) => {
    try {
        const {text} = req.body ; 
        let {img} = req.body ; 
        if(!text && !img) {
            return res.json({error : 'Please provide text or an image'}) ;
        }

        const user = req.user ;

        if(img) {
            const uploadedResponse =await cloudinary.uploader.upload(img) ; 
            img = uploadedResponse.secure_url ;

        }
        const post = new Post({
            text,
            img,
            user : user._id 
         });
        await post.save() ;
        res.json({message : "post published successfully" }) ;
    }catch(err) {
        console.log(err) ;
        res.status(500).json({error : 'Internal Server error'}) ;
    }
 
}

export const deletePost = async (req,res) => {
    try {

        const post = await Post.findById(req.params.id) ;
        if(!post) {
            return res.status(404).json({error : 'Post not found'}) ;
        }

        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({error : 'Unauthorized to delete this post'}) ;
        }
        if(post.img) {
            const imgId = post.img.split("/").pop().split(".")[0] ; 
            await cloudinary.uploader.destroy(imgId) ;

        }
        await Post.deleteOne({_id : post._id}) ;
        res.json({message : 'Post deleted successfully'}) ; 
    
    }catch(err) {
        console.log(err) ;
        res.json({error : 'Internal Server error'}) ;
    }

}

export const commentPost = async (req,res) => {
    try {
        const {text } = req.body ; 
        const postId = req.params.id ;
        console.log(postId,text) ; 
        const user = req.user ; 
        if(!text) {
            return res.json({error : 'Please provide a comment'}) ;
        }

        const post = await Post.findById(postId) ; 
        if(!post) {
            return res.json({error : 'Post not found'}) ;
        }
        post.comments.push({
            text,
            user : user._id
        }) ;
        await post.save() ;
        res.json({message : "comment posted successfully" ,post  }) ;
    }catch(err) {
        console.log(err) ;
        res.json({error : 'Internal Server error'}) ;
    }
}

export const likeUnlike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user has already liked the post
        const hasLiked = post.likes.includes(userId.toString());

        if (hasLiked) {
            // Unlike the post
            await Post.findByIdAndUpdate(
                postId,
                { $pull: { likes: userId } },
                { new: true }
            );

            await notifications.create({
                from: userId,
                to: post.user,
                type: 'unlike',
                post: postId,
                user: userId,
            });

            await User.findByIdAndUpdate(
                userId,
                { $pull: { likedPosts: postId } }
            );

            const updatedLikes = post.likes.filter(likeId => likeId.toString() !== userId.toString());
            return res.status(200).json({ message: 'Post unliked successfully', updatedLikes });
        } else {
            // Like the post
            post.likes.push(userId);
            await post.save();

            await notifications.create({
                from: userId,
                to: post.user,
                type: 'like',
                post: postId,
                user: userId,
            });

            await User.findByIdAndUpdate(
                userId,
                { $push: { likedPosts: postId } }
            );

            return res.status(200).json({ message: 'Post liked successfully', updatedLikes: post.likes });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getAllPost = async (req,res) => {
    try {
        const posts = await Post.find()
       .sort({ createdAt: -1 })
       .populate('user', ['username', 'profileImg'])
       .populate('comments.user', ['username', 'profileImg'])
       .lean() ;
       console.log(posts) ; 
       res.json(posts) ; 

}catch(err) {
    console.log(err) ;
    res.status(500).json({error : 'Internal Server error'}) ;
}
}


export const getPostByUsername = async (req, res) => {
  try {
    const { username } = req.params; 
    console.log(`Fetching posts for username: ${username}`);

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log(`User ID: ${user._id}`);
    const posts = await Post.find({ user: user._id }).populate("user",["username","profileImg"]).lean();

    return res.status(200).json(posts);
  } catch (err) {
    console.error(`Error fetching posts: ${err.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate("user", ["username", "profileImg"])
      .populate("comments.user", ["username", "profileImg"]);

    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server error' });
  }
};


export const getFollowingPosts = async (req,res) => {
    
    try {

    
    const userId = req.user._id ; 
    const user = await User.findById(userId) ;
    if(!user) {
        return res.status(404).json({error : 'User not found'}) ;
    }
    const followingUsers = user.following ;
    const posts = await Post.find({user : {$in : followingUsers}}).select({createdAt : -1}).populate("user",["username","profileImg"]).populate("comments.user",["username","profileImg"]) ; 
    res.status(200).json(posts) ;

    }catch(err) {
        console.log(err.message)  ;
        res.status(500).json({error : 'Internal Server error'}) ;
    }


}