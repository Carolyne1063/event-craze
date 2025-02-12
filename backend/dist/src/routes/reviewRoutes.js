"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = __importDefault(require("../controllers/reviewController"));
const router = express_1.default.Router();
// Create a review
router.post("/create", reviewController_1.default.createReview);
// Get a review by its ID
router.get("/:reviewId", reviewController_1.default.getReviewById);
// Get all reviews for a specific event
router.get("/event/:eventId", reviewController_1.default.getReviewsByEvent);
// (Optional) Get all reviews (for admin)
router.get("/", reviewController_1.default.getAllReviews);
// Update a review
router.put("/update/:reviewId", reviewController_1.default.updateReview);
// Delete a review
router.delete("/delete/:reviewId", reviewController_1.default.deleteReview);
exports.default = router;
