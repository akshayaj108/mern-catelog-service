import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandlers";
import categoryRouter from "./category/category-router";

const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.get("/", async (req, res) => {
  // const error = createHttpError(401, "Bad Request");
  // next(error);
  res.json({
    message: "Welcome to the Catelog Service",
  });
});
app.use("/categories", categoryRouter);
//global error handler
app.use(globalErrorHandler);

export default app;
