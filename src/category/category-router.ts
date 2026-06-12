import express from "express";
import { CategoryController } from "./category-controller";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import categoryValidator from "./category-validator";
import { asyncErrorCatchWrapper } from "../common/utils/errorCatchWerapper";
const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
  "/",
  categoryValidator,
  asyncErrorCatchWrapper(categoryController.create),
);

export default router;
