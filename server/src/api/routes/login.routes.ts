import express from 'express';
import { tenantLogin,adminLogin } from '../controllers/login.ts';

const router = express.Router()

router.post('/admin-login',adminLogin)

router.post('/user-login',tenantLogin)

export default router