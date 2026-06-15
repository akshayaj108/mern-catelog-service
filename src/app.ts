import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandlers";
import categoryRouter from "./category/category-router";
import productRouter from "./product/product-router";
import toppingRouter from "./topping/topping-router";
import cookieParser from "cookie-parser";

const app = express();
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json());

app.get("/", async (req, res) => {
  // const error = createHttpError(401, "Bad Request");
  // next(error);
  res.json({
    message: "Welcome to the Catelog Service",
  });
});
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/topping", toppingRouter);
//global error handler
app.use(globalErrorHandler);

export default app;
