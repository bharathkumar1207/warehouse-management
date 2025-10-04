import express from 'express';
import { tenantAdminSignUp, adminSignup } from '../controllers/signup.ts';
const router = express.Router()

router.post('/admin-signup',adminSignup)

router.post('/tenant-admin-signup',tenantAdminSignUp)

export default router