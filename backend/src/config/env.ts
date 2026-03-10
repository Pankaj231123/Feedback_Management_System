import dotenv from "dotenv";

dotenv.config();

export const config = {
   mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/feedback_db",
  },
  gemini: {
    apiKey: process.env.GOOGLE_API_KEY || "",
  },
  email: {
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
  },
  teamEmails: {
    engineering: process.env.ENG_EMAIL || "",
    product: process.env.PRODUCT_EMAIL || "",
    support: process.env.SUPPORT_EMAIL || "",
    sales: process.env.SALES_EMAIL || "",
  },
  server: {
    port: parseInt(process.env.PORT || "5000"),
    nodeEnv: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  },
};
