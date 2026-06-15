import { NextFunction, Request, Response } from "express";
import { ToppingService } from "./topping-service";
import { Logger } from "winston";
import { AuthRequest, FileStorage } from "../common/types";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { UploadedFile } from "express-fileupload";
import { ToppingFilter } from "./topping-types";

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
    res.json({ id: newTopping._id });
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      next(createHttpError(400, results.array()[0]?.msg as string));
    }
    const toppingId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    if (!toppingId) {
      return next(createHttpError(400, "Topping id is required"));
    }
    const topping = await this.toppingService.getTopping(toppingId);
    if (!topping) {
      return next(
        createHttpError(404, "Topping not found for this topping id"),
      );
    }
    //check is its restaurant manager or admin if not then return 403

    const userTenantId = (req as AuthRequest).auth.tenantId;
    const userRole = (req as AuthRequest).auth.role;

    if (
      userRole !== "admin" &&
      topping.tenantId.trim() !== String(userTenantId)
    ) {
      return next(
        createHttpError(403, "You are not allow to access this topping"),
      );
    }

    const currentImage = topping.image;
    let imageUrl = currentImage;
    if (req.files && req.files.image) {
      await this.storageService.delete(currentImage);
      const newImage = req.files.image as UploadedFile;
      const uniqueChar = crypto.randomUUID();

      imageUrl = await this.storageService.upload({
        fileName: `${uniqueChar} - ${newImage.name}`,
        fileData: newImage.data,
      });
    }

    const { name, price, tenantId, isPublish } = req.body;
    const toppingData = {
      name,
      image: imageUrl,
      price,
      tenantId,
      isPublish,
    };
    const newTopping = await this.toppingService.update(toppingId, toppingData);
    this.logger.info("Topping updated", { id: newTopping._id });
    res.json({
      message: "Tooping updated successfully",
      id: toppingId,
    });
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const toppingId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    if (!toppingId) {
      return next(createHttpError(400, "Topping id is required"));
    }
    const topping = await this.toppingService.getTopping(toppingId);
    if (!topping) {
      return next(
        createHttpError(404, "Topping not found for this topping id"),
      );
    }
    //check is its restaurant manager or admin if not then return 403

    const userTenantId = (req as AuthRequest).auth.tenantId;
    const userRole = (req as AuthRequest).auth.role;

    if (
      userRole !== "admin" &&
      topping.tenantId.trim() !== String(userTenantId)
    ) {
      return next(
        createHttpError(403, "You are not allow to access this topping"),
      );
    }
    const currentImage = topping.image;
    if (currentImage) {
      await this.storageService.delete(currentImage);
    }
    await this.toppingService.deleteTopping(toppingId);
    this.logger.info("Topping deleted", { id: toppingId });
    res.json({
      message: "Topping deleted successfully",
      id: toppingId,
    });
  };

  getTopping = async (req: Request, res: Response, next: NextFunction) => {
    const toppingId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    if (!toppingId) {
      return next(createHttpError(400, "Topping id is required"));
    }
    const topping = await this.toppingService.getTopping(toppingId);
    if (!topping) {
      return next(
        createHttpError(404, "Topping not found for this topping id"),
      );
    }
    this.logger.info("Topping fetched for this id", { id: toppingId });
    res.json(topping);
  };

  getToppings = async (req: Request, res: Response) => {
    const { q, tenantId, isPublish, page, limit } = req.query;
    const filters: ToppingFilter = {};
    if (isPublish === "true") {
      filters.isPublish = true;
    }
    if (tenantId) {
      filters.tenantId = tenantId as string;
    }
    const toppings = await this.toppingService.getAllToping(
      q as string,
      filters,
      {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      },
    );
    this.logger.info("All toppings are fetched");
    res.json(toppings);
  };
}
