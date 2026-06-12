import { config } from "dotenv";

config();

const { PORT, MONGO_URI, NODE_ENV } = process.env;

export const CONFIG = {
  PORT,
  MONGO_URI,
  NODE_ENV,
};
