import { Request, Response } from "express";
import ReviewService from "../services/reviewService";

class ReviewController {
  // Create a new review.
  static async createReview(req: Request, res: Response) {
    try {
      const { userId, eventId, rating, comment } = req.body;
      const review = await ReviewService.createReview(userId, eventId, rating, comment);
      res.status(201).json(review);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
    }
  }

  // Get a review by its ID.
  static async getReviewById(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const review = await ReviewService.getReviewById(reviewId);
      res.status(200).json(review);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
    }
  }

  // Get all reviews for a specific event.
  static async getReviewsByEvent(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const reviews = await ReviewService.getReviewsByEvent(eventId);
      res.status(200).json(reviews);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
    }
  }

  // Get all reviews (for admin).
  static async getAllReviews(req: Request, res: Response) {
    try {
      const reviews = await ReviewService.getAllReviews();
      res.status(200).json(reviews);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
    }
  }

  // Update a review.
  static async updateReview(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const review = await ReviewService.updateReview(reviewId, { rating, comment });
      res.status(200).json(review);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
    }
  }

  // Delete a review.
  static async deleteReview(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const result = await ReviewService.deleteReview(reviewId);
      res.status(200).json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
    }
  }
}

export default ReviewController;
