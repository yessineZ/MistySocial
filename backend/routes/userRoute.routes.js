import express from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import { getUserProfile , followUnfollowUser , getUsers } from "../controllers/user.Controller.js";
import { suggestUsers , UpdateUser ,getUsersForSideBar} from "../controllers/user.Controller.js";



const router  = express.Router() ; 


router.get('/profile/:username',checkAuth,getUserProfile) ; 
router.get('/user/:id',checkAuth,followUnfollowUser) ; 
router.get('/users',getUsers)  ;
router.get('/suggest',checkAuth,suggestUsers) ;
router.post('/update',checkAuth,UpdateUser) ; 
router.get('/messages',checkAuth,getUsersForSideBar) ; 


export default router