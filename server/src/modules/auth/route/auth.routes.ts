import express from 'express';
import * as authControllers from "../controllers/auth.controllers";
import asyncHandeler from 'express-async-handler';

const router = express.Router();


// router.post('/login', asyncHandeler(authControllers.login));
// router.post('/logout', asyncHandeler(authControllers.logout));
// router.post('/refresh-token', asyncHandeler(authControllers.refreshToken));
// router.post('/requestPasswordReset', asyncHandeler(authControllers.requestPasswordReset));
// router.post('/resetPassword', asyncHandeler(authControllers.resetPassword));
// router.post('/resendOTP', asyncHandeler(authControllers.resendOTP));


export default router;
