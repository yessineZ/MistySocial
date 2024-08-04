import express from 'express';
import { sendMessage } from '../controllers/messages.Controller.js';
import { checkAuth } from "../middlewares/checkAuth.js";
import { getMessages } from '../controllers/messages.Controller.js';
const router = express.Router() ; 

router.get('/:id',checkAuth,getMessages) ; 

router.post('/send/:id',checkAuth,sendMessage) ; 

export default router;  