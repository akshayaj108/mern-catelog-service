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
const toppingController = new ToppingController(
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

  asyncErrorCatchWrapper(toppingController.create),
);

router.put(
  "/:id",
  authenticates,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
    abortOnLimit: true, //The upload is immediately stopped. User get error about size limit
  }),

  asyncErrorCatchWrapper(toppingController.update),
);

router.delete(
  "/:id",
  authenticates,
  canAccess([Roles.ADMIN, Roles.MANAGER]),

  asyncErrorCatchWrapper(toppingController.delete),
);

router.get("/:id", asyncErrorCatchWrapper(toppingController.getTopping));
router.get("/", asyncErrorCatchWrapper(toppingController.getToppings));

export default router;
