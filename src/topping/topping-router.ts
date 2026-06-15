import express from "express";
import { asyncErrorCatchWrapper } from "../common/utils/errorCatchWerapper";
import authenticates from "../common/middlewares/authenticates";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";

import logger from "../config/logger";
import fileUpload from "express-fileupload";
import { CloudinaryStorage } from "../common/services/CloudinaryStorage";
import { ToppingService } from "./topping-service";
import { ToppingController } from "./topping-controller";

const router = express.Router();
const cloudinaryStorage = new CloudinaryStorage();
const toppingService = new ToppingService();
const productController = new ToppingController(
  toppingService,
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

  asyncErrorCatchWrapper(productController.create),
);

export default router;
