import express from "express";
import paymentController from "../controller/payment.controller";
import { authenticateUser } from "../../../middlewares/authMiddleware";

const router = express.Router();

// Protected routes - require authentication
router.post("/create-order", authenticateUser, paymentController.createOrder);
router.post("/verify", authenticateUser, paymentController.verifyPayment);
router.get("/history", authenticateUser, paymentController.getPaymentHistory);
router.get("/:id", authenticateUser, paymentController.getPaymentById);

// Public route - webhook (verified via signature)
router.post("/webhook", paymentController.handleWebhook);

export default router;
