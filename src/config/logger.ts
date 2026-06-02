import winston from "winston";
import { Config } from "./index";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: { service: "catelog-service" },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      level: "info",
      dirname: "logs",
      filename: "catelog-service.log",
      silent: Config.NODE_ENV === "test",
    }),
    new winston.transports.File({
      level: "error",
      dirname: "logs",
      filename: "catelog-service-error.log",
      silent: Config.NODE_ENV === "test",
    }),
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

export default logger;
