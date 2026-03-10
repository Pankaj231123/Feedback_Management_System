export interface Feedback {
  _id?: string;
  name: string;
  email: string;
  message: string;
  category?: "Bug" | "Feature Request" | "Complaint" | "Praise" | "Other";
  priority?: "Low" | "Medium" | "High";
  sentiment?: "Positive" | "Neutral" | "Negative";
  team?: "Engineering" | "Product" | "Support" | "Sales";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFeedbackRequest {
  name: string;
  email: string;
  message: string;
  category?: Feedback["category"];
  priority?: Feedback["priority"];
}

export interface ApiResponse<T> {
  message?: string;
  error?: string;
  data?: T;
  count?: number;
}
