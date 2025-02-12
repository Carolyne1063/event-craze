"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reviewService_1 = __importDefault(require("../services/reviewService"));
class ReviewController {
    // Create a new review.
    static async createReview(req, res) {
        try {
            const { userId, eventId, rating, comment } = req.body;
            const review = await reviewService_1.default.createReview(userId, eventId, rating, comment);
            res.status(201).json(review);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
        }
    }
    // Get a review by its ID.
    static async getReviewById(req, res) {
        try {
            const { reviewId } = req.params;
            const review = await reviewService_1.default.getReviewById(reviewId);
            res.status(200).json(review);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
        }
    }
    // Get all reviews for a specific event.
    static async getReviewsByEvent(req, res) {
        try {
            const { eventId } = req.params;
            const reviews = await reviewService_1.default.getReviewsByEvent(eventId);
            res.status(200).json(reviews);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
        }
    }
    // Get all reviews (for admin).
    static async getAllReviews(req, res) {
        try {
            const reviews = await reviewService_1.default.getAllReviews();
            res.status(200).json(reviews);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
        }
    }
    // Update a review.
    static async updateReview(req, res) {
        try {
            const { reviewId } = req.params;
            const { rating, comment } = req.body;
            const review = await reviewService_1.default.updateReview(reviewId, { rating, comment });
            res.status(200).json(review);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
        }
    }
    // Delete a review.
    static async deleteReview(req, res) {
        try {
            const { reviewId } = req.params;
            const result = await reviewService_1.default.deleteReview(reviewId);
            res.status(200).json(result);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
        }
    }
}
exports.default = ReviewController;
