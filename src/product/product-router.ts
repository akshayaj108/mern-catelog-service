import express from "express";
import { asyncErrorCatchWrapper } from "../common/utils/errorCatchWerapper";
import authenticates from "../common/middlewares/authenticates";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import { ProductController } from "./product-controller";
import productValidator from "./product-validator";
import { ProductService } from "./product-service";
import logger from "../config/logger";
import fileUpload from "express-fileupload";

const router = express.Router();
const productService = new ProductService();
const productController = new ProductController(productService, logger);

router.post(
  "/",
  authenticates,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload(),
  productValidator,
  asyncErrorCatchWrapper(productController.create),
);

export default router;
