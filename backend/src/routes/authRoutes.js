import express from 'express'; 
const router = express.Router(); 
import { authController } from '../controllers/authController.js';

router.post('/login', authController.login)

export default router; 