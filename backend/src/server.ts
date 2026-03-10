import app from "./app.js";
import { connectDB } from "./config/database.js";
import { config } from "./config/env.js";

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const PORT = config.server.port;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 API: http://localhost:${PORT}/api/feedback`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
