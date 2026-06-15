import { NextFunction, Request, Response } from "express";
import { ToppingService } from "./topping-service";
import { Logger } from "winston";
import { FileStorage } from "../common/types";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { UploadedFile } from "express-fileupload";

export class ToppingController {
  constructor(
    private readonly toppingService: ToppingService,
    private readonly logger: Logger,
    private readonly storageService: FileStorage,
  ) {}
  create = async (req: Request, res: Response, next: NextFunction) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      next(createHttpError(400, results.array()[0]?.msg as string));
    }
    if (!req.files || !req.files.image) {
      return next(createHttpError(400, "Product image is required"));
    }
    const image = req.files.image as UploadedFile;
    const uniqueChar = crypto.randomUUID();

    const imageUrl = await this.storageService.upload({
      fileName: `${uniqueChar}-${image.name}`,
      fileData: image.data,
    });
    const { name, price, tenantId, isPublish } = req.body;
    const toppingData = {
      name,
      image: imageUrl,
      price,
      tenantId,
      isPublish,
    };
    const newTopping = await this.toppingService.create(toppingData);
    this.logger.info("Topping is created", { id: newTopping._id });
    res.json({ id: newTopping });
  };
}
