import express from 'express'; 
import {signUp,signIn, logOut,getMe} from '../controllers/auth.Controller.js'
import { checkAuth } from '../middlewares/checkAuth.js';
const router = express.Router() ; 
router.post('/signUp',signUp)  ;
router.post('/login',signIn) ; 
router.get('/logout',logOut) ;
router.get('/getMe',checkAuth,getMe) ;










export default router ;  