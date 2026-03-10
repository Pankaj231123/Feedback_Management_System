import { Request, Response } from "express";
import Feedback from "../models/Feedback.js";
import { classifyFeedback } from "../services/llm.service.js";
import { sendTeamNotification } from "../services/email.service.js";

const ALLOWED_CATEGORIES = [
  "Bug",
  "Feature Request",
  "Complaint",
  "Praise",
  "Other",
];

const ALLOWED_PRIORITIES = ["Low", "Medium", "High"];

export async function createFeedback(req: Request, res: Response) {
  try {
    const { name, email, message, category, priority } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }

    const userCategory =
      typeof category === "string" && ALLOWED_CATEGORIES.includes(category)
        ? category
        : undefined;

    const userPriority =
      typeof priority === "string" && ALLOWED_PRIORITIES.includes(priority)
        ? priority
        : undefined;

    const feedback = new Feedback({
      name,
      email,
      message,
      category: userCategory ?? "Other",
      priority: userPriority ?? "Medium",
      sentiment: "Neutral",
      team: "Support",
    });

    // Save to database
    await feedback.save();

    res.status(201).json({
      message: "Feedback created successfully",
      data: feedback,
    });

    // Kick off classification + notification asynchronously
    classifyFeedback(message)
      .then(async (classification) => {
        try {
          const updates: Record<string, any> = {
            sentiment: classification.sentiment,
            team: classification.team,
          };

          if (!userCategory) {
            updates.category = classification.category;
          }

          if (!userPriority) {
            updates.priority = classification.priority;
          }

          const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedback._id,
            updates,
            { new: true }
          );

          const latest = updatedFeedback ?? feedback;

          sendTeamNotification(latest.team ?? classification.team, {
            name,
            email,
            message,
            category: latest.category ?? classification.category,
            priority: latest.priority ?? classification.priority,
            sentiment: latest.sentiment ?? classification.sentiment,
          }).catch((error) =>
            console.error("Email notification failed:", error)
          );
        } catch (updateError) {
          console.error("Error updating classified feedback:", updateError);
        }
      })
      .catch((classificationError) =>
        console.error("Async classification failed:", classificationError)
      );
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ error: "Failed to create feedback" });
  }
}

export async function getFeedbacks(req: Request, res: Response) {
  try {
    const { name, category, priority } = req.query;

    // Build filter query
    const query: Record<string, any> = {};

    if (name) {
      query.name = { $regex: name as string, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (priority) {
      query.priority = priority;
    }

    // Fetch feedbacks sorted by createdAt (newest first)
    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
}

export async function getFeedbackById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.status(200).json({
      data: feedback,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
}

export async function deleteFeedback(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.status(200).json({
      message: "Feedback deleted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
}
