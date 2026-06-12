import config from "config";
import app from "./app";
import logger from "./config/logger";
import { initDb } from "./config/db";

async function startServer() {
  const PORT: number = config.get("server.port") || 5503;
  try {
    await initDb();
    logger.info("Database connected successfully");
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting the server:", error);
    process.exit(1);
  }
}

void startServer();
