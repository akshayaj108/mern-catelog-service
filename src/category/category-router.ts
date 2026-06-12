import express from "express";
import { CategoryController } from "./category-controller";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import categoryValidator from "./category-validator";
import { asyncErrorCatchWrapper } from "../common/utils/errorCatchWerapper";
import authenticates from "../common/middlewares/authenticates";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import createHttpError from "http-errors";
const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
  "/",
  authenticates,
  canAccess([Roles.ADMIN]),
  categoryValidator,
  asyncErrorCatchWrapper(categoryController.create),
);
//for invalid route error handling for update
router.patch("/", (req, res, next) => {
  next(createHttpError(400, "Category id is required"));
});
router.patch(
  "/:id",
  authenticates,
  canAccess([Roles.ADMIN]),
  categoryValidator,
  asyncErrorCatchWrapper(categoryController.update),
);

export default router;
