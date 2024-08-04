import express from 'express' ; 
import { checkAuth } from '../middlewares/checkAuth.js';
import { getNotifications , deleteNotifications} from '../controllers/notification.Controller.js';
const router = express.Router() ; 

router.get('/',checkAuth,getNotifications) ; 
router.delete('/delete',checkAuth,deleteNotifications) ; 


export default router ; 