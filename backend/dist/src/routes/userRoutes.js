"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
const userController = new userController_1.UserController();
// Register User
router.post('/register', (0, express_async_handler_1.default)((req, res) => userController.register(req, res)));
// Login User
router.post('/login', (0, express_async_handler_1.default)(async (req, res) => {
    await userController.login(req, res);
}));
// Get user by ID
// Get user by ID
router.get('/:userId', (0, express_async_handler_1.default)(async (req, res) => {
    await userController.getUser(req, res);
}));
// Get all users
router.get('/', (0, express_async_handler_1.default)((req, res) => userController.getAllUsers(req, res)));
// Update user
router.put('/:userId', (0, express_async_handler_1.default)(async (req, res) => {
    await userController.updateUser(req, res);
}));
// Delete user
router.delete('/:userId', (0, express_async_handler_1.default)(async (req, res) => {
    await userController.deleteUser(req, res);
}));
exports.default = router;
