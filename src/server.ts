import config from "config";
import app from "./app";
import logger from "./config/logger";
import { initDb } from "./config/db";
import { createMessageBroker } from "./common/factories/brokerFactory";
import { MessageProducerBroker } from "./types/broker";

async function startServer() {
  const PORT: number = config.get("server.port") || 5503;
  let messageProducerBroker: MessageProducerBroker | null = null;
  try {
    await initDb();
    logger.info("Database connected successfully");
    messageProducerBroker = createMessageBroker();
    await messageProducerBroker.connect();
    logger.info("Broker is connected");
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  } catch (error) {
    if (messageProducerBroker) {
      messageProducerBroker.disconnect();
    }
    logger.error("Error starting the server:", error);
    process.exit(1);
  }
}

void startServer();
