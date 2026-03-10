import { Router } from "express";
import {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  deleteFeedback,
} from "../controllers/feedbackController.js";

const router = Router();

/**
 * POST /api/feedback
 * Create new feedback with LLM classification
 */
router.post("/", createFeedback);

/**
 * GET /api/feedback
 * Get all feedbacks with optional filters
 * Query params: name, category, priority
 */
router.get("/", getFeedbacks);

/**
 * GET /api/feedback/:id
 * Get feedback by ID
 */
router.get("/:id", getFeedbackById);

/**
 * DELETE /api/feedback/:id
 * Delete feedback by ID
 */
router.delete("/:id", deleteFeedback);

export default router;
