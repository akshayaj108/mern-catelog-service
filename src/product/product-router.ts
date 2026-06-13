import express from "express";
import { asyncErrorCatchWrapper } from "../common/utils/errorCatchWerapper";
import authenticates from "../common/middlewares/authenticates";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import { ProductController } from "./product-controller";
import productValidator from "./product-validator";

const router = express.Router();
const productController = new ProductController();

router.post(
  "/",
  authenticates,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  productValidator,
  asyncErrorCatchWrapper(productController.create),
);

export default router;
