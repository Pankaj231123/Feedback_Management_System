import app from "./app.js";
import { connectDB } from "./config/database.js";
import { config } from "./config/env.js";

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const PORT = config.server.port;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 API: http://0.0.0.0:${PORT}/api/feedback`);
      console.log(`🏥 Health: http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
