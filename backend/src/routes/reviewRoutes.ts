import express from "express";
import ReviewController from "../controllers/reviewController";

const router = express.Router();

// Create a review
router.post("/create", ReviewController.createReview);

// Get a review by its ID
router.get("/:reviewId", ReviewController.getReviewById);

// Get all reviews for a specific event
router.get("/event/:eventId", ReviewController.getReviewsByEvent);

// (Optional) Get all reviews (for admin)
router.get("/", ReviewController.getAllReviews);

// Update a review
router.put("/update/:reviewId", ReviewController.updateReview);

// Delete a review
router.delete("/delete/:reviewId", ReviewController.deleteReview);

export default router;
