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
import { CloudinaryStorage } from "../common/services/CloudinaryStorage";

const router = express.Router();
const cloudinaryStorage = new CloudinaryStorage();
const productService = new ProductService();
const productController = new ProductController(
  productService,
  logger,
  cloudinaryStorage,
);

router.post(
  "/",
  authenticates,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
    abortOnLimit: true, //The upload is immediately stopped. User get error about size limit
  }),
  productValidator,
  asyncErrorCatchWrapper(productController.create),
);
router.put(
  "/:productId",
  authenticates,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
    abortOnLimit: true, //The upload is immediately stopped. User get error about size limit
  }),
  productValidator,
  asyncErrorCatchWrapper(productController.update),
);

router.get("/", asyncErrorCatchWrapper(productController.getProdctList));

router.get("/:id", asyncErrorCatchWrapper(productController.getProductById));

export default router;
