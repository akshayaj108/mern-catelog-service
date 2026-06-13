import { NextFunction, Response } from "express";
import crypto from "node:crypto";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Logger } from "winston";
import { FileStorage } from "../common/types";
import { UploadedFile } from "express-fileupload";

export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly logger: Logger,
    private readonly storageService: FileStorage,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      next(createHttpError(400, results.array()[0]?.msg as string));
    }
    const {
      name,
      descriptions,
      priceConfiguration,
      attributes,
      tenantId,
      categoryId,
      isPublish,
    } = req.body;
    if (!req.files || !req.files.image) {
      return next(createHttpError(400, "Product image is required"));
    }
    const image = req.files.image as UploadedFile;
    const uniqueChar = crypto.randomUUID();

    const imageUrl = await this.storageService.upload({
      fileName: `${uniqueChar}-${image.name}`,
      fileData: image.data,
    });
    const product = {
      name,
      descriptions,
      priceConfiguration: JSON.parse(priceConfiguration as string),
      attributes: JSON.parse(attributes as string),
      tenantId,
      categoryId,
      isPublish,
      image: imageUrl,
    };
    const newProduct = await this.productService.create(product);
    this.logger.info("Product is added", { id: newProduct._id });
    res.json({
      message: "Product created",
      id: newProduct._id,
    });
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    //validation check
    const results = validationResult(req);
    if (!results.isEmpty()) {
      next(createHttpError(400, results.array()[0]?.msg as string));
    }
    //id validation
    const productId = Array.isArray(req.params.productId)
      ? req.params.productId[0]
      : req.params.productId;
    if (!productId) {
      return next(createHttpError(400, "Product id is required"));
    }
    //body data destructuring
    const {
      name,
      descriptions,
      priceConfiguration,
      attributes,
      tenantId,
      categoryId,
      isPublish,
    } = req.body;
    let imageUrl: string | undefined;
    let productOldImage: string | undefined;
    if (req.files && req.files.image) {
      productOldImage = await this.productService.getProductImage(productId);
      if (productOldImage) {
        await this.storageService.delete(productOldImage);
      }
      const image = req.files.image as UploadedFile;
      const uniqueChar = crypto.randomUUID();
      imageUrl = await this.storageService.upload({
        fileName: `${uniqueChar}-${image.name}`,
        fileData: image.data,
      });
    } else {
      productOldImage = await this.productService.getProductImage(productId);
    }

    const resolvedImage = imageUrl ?? productOldImage;
    //if product dont have old image and req body image then return error
    if (!resolvedImage) {
      return next(createHttpError(400, "Product image is required"));
    }

    const product = {
      name,
      descriptions,
      priceConfiguration: JSON.parse(priceConfiguration as string),
      attributes: JSON.parse(attributes as string),
      tenantId,
      categoryId,
      isPublish,
      image: resolvedImage,
    };
    const updatedProduct = await this.productService.upadte(productId, product);
    this.logger.info("Product updated successfully", {
      id: updatedProduct?._id,
    });
    //note: if we leave controller without res then it will process untill timeout
    res.json({
      message: "Product updated",
      id: updatedProduct,
    });
  };
}
