import express from "express";
import { createPost , deletePost , commentPost, likeUnlike , getAllPost ,getPostByUsername ,getLikedPosts ,getFollowingPosts} from "../controllers/post.Controller.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router() ; 


router.get('/all',checkAuth,getAllPost)  ;
router.get('/all/:username',checkAuth,getPostByUsername) ; 
router.get('/following',checkAuth,getFollowingPosts) ; 
router.get('/likedPosts/:id',checkAuth,getLikedPosts) ; 
router.post('/create',checkAuth,createPost) ;
 router.post('/like/:id',checkAuth,likeUnlike) ; 
router.post('/comment/:id',checkAuth,commentPost) ;
router.get('/posts',checkAuth,getAllPost) ; 
router.delete('/delete/:id',checkAuth,deletePost)  ;


export default router ; 