import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import logger from "./config/logger";

const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.get("/", async (req, res, next) => {
  const error = createHttpError(401, "Bad Request");
  next(error);
  // res.send("Welcome to the Catelog Service");
});

//global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error("Error occurred:", err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        message: err.message,
        statusCode: statusCode,
        path: req.path,
        location: "",
      },
    ],
  });
});

export default app;
