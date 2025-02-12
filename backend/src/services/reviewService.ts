import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ReviewService {
  // Create a review for an event by a user.
  static async createReview(
    userId: string,
    eventId: string,
    rating: number,
    comment?: string
  ) {
    try {
      // Optionally, you can check if the event exists, etc.
      const review = await prisma.review.create({
        data: {
          userId,
          eventId,
          rating,
          comment,
        },
        include: {
          event: true,
          user: true,
        },
      });
      return review;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred while creating the review.");
    }
  }

  // Retrieve a review by its ID.
  static async getReviewById(reviewId: string) {
    try {
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: { event: true, user: true },
      });
      if (!review) {
        throw new Error("Review not found.");
      }
      return review;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred while retrieving the review.");
    }
  }

  // Retrieve all reviews for a specific event.
  static async getReviewsByEvent(eventId: string) {
    try {
      const reviews = await prisma.review.findMany({
        where: { eventId },
        include: { event: true, user: true },
      });
      return reviews;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred while retrieving reviews for the event.");
    }
  }

  // Retrieve all reviews (e.g., for admin viewing all reviews).
  static async getAllReviews() {
    try {
      const reviews = await prisma.review.findMany({
        include: { event: true, user: true },
      });
      return reviews;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred while retrieving all reviews.");
    }
  }

  // Update a review.
  static async updateReview(reviewId: string, data: { rating?: number; comment?: string }) {
    try {
      const review = await prisma.review.update({
        where: { id: reviewId },
        data,
        include: { event: true, user: true },
      });
      return review;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred while updating the review.");
    }
  }

  // Delete a review.
  static async deleteReview(reviewId: string) {
    try {
      const review = await prisma.review.delete({
        where: { id: reviewId },
      });
      return { message: "Review deleted successfully" };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred while deleting the review.");
    }
  }
}

export default ReviewService;
