import nodemailer from "nodemailer";
import { config } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

const teamEmailMap: Record<string, string> = {
  Engineering: config.teamEmails.engineering,
  Product: config.teamEmails.product,
  Support: config.teamEmails.support,
  Sales: config.teamEmails.sales,
};

export async function sendTeamNotification(
  team: string,
  feedbackData: {
    name: string;
    email: string;
    message: string;
    category: string;
    priority: string;
    sentiment: string;
  }
) {
  try {
    const recipientEmail = teamEmailMap[team];

    if (!recipientEmail) {
      console.log(`⚠️  No email configured for team: ${team}`);
      return;
    }

    const subject = `[${feedbackData.priority}] New ${feedbackData.category} - ${feedbackData.sentiment} Sentiment`;

    const htmlContent = `
      <h2>New Feedback Received</h2>
      <p><strong>Name:</strong> ${feedbackData.name}</p>
      <p><strong>Email:</strong> ${feedbackData.email}</p>
      <p><strong>Category:</strong> ${feedbackData.category}</p>
      <p><strong>Priority:</strong> ${feedbackData.priority}</p>
      <p><strong>Sentiment:</strong> ${feedbackData.sentiment}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${feedbackData.message}</p>
    `;

    const mailOptions = {
      from: config.email.user,
      to: recipientEmail,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${team} team`);
  } catch (error) {
    console.error("❌ Email sending error:", error);
    // Don't throw - let the feedback be saved even if email fails
  }
}
