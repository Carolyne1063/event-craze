"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const forgotPasswordController_1 = require("../controllers/forgotPasswordController");
const router = express_1.default.Router();
// ✅ Ensure async handlers are passed correctly
router.post('/forgot-password', async (req, res, next) => {
    try {
        await (0, forgotPasswordController_1.forgotPassword)(req, res);
    }
    catch (error) {
        next(error); // Pass errors to Express error handler
    }
});
router.post('/verify-otp', async (req, res, next) => {
    try {
        await (0, forgotPasswordController_1.verifyOtp)(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/reset-password', async (req, res, next) => {
    try {
        await (0, forgotPasswordController_1.resetPassword)(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
