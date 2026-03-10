import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  name: string;
  email: string;
  message: string;
  category?: string;
  priority?: string;
  sentiment?: string;
  team?: string;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
    },
    category: {
      type: String,
      enum: ["Bug", "Feature Request", "Complaint", "Praise", "Other"],
      default: "Other",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      default: "Neutral",
    },
    team: {
      type: String,
      enum: ["Engineering", "Product", "Support", "Sales"],
      default: "Support",
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model<IFeedback>("Feedback", feedbackSchema);

export default Feedback;
