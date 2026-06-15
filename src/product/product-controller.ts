import { NextFunction, Response } from "express";
import crypto from "node:crypto";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Logger } from "winston";
import { AuthRequest, FileStorage } from "../common/types";
import { UploadedFile } from "express-fileupload";
import { ProductFilter } from "./product-types";
import mongoose from "mongoose";

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

    const product = await this.productService.getProduct(productId);

    if (!product) {
      return next(
        createHttpError(404, "Product not found for this product id"),
      );
    }

    const userTenantId = (req as AuthRequest).auth?.tenantId;
    const userRole = (req as AuthRequest).auth.role;
    if (
      userRole !== "admin" &&
      product?.tenantId.trim() !== String(userTenantId)
    ) {
      return next(
        createHttpError(503, "You are not allow to access this product"),
      );
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

    //image upload
    const productOldImage: string = product.image;
    let imageUrl = productOldImage;

    if (req.files && req.files.image) {
      if (productOldImage) {
        await this.storageService.delete(productOldImage);
      }
      const image = req.files.image as UploadedFile;
      const uniqueChar = crypto.randomUUID();
      imageUrl = await this.storageService.upload({
        fileName: `${uniqueChar}-${image.name}`,
        fileData: image.data,
      });
    }

    const resolvedImage = imageUrl ?? productOldImage;
    //if product dont have old image and req body image then return error
    if (!resolvedImage) {
      return next(createHttpError(400, "Product image is required"));
    }

    const productUpdatedData = {
      name,
      descriptions,
      priceConfiguration: JSON.parse(priceConfiguration as string),
      attributes: JSON.parse(attributes as string),
      tenantId,
      categoryId,
      isPublish,
      image: resolvedImage,
    };
    const updatedProduct = await this.productService.upadte(
      productId,
      productUpdatedData,
    );
    this.logger.info("Product updated successfully", {
      id: updatedProduct?._id,
    });
    //note: if we leave controller without res then it will process untill timeout
    res.json({
      message: "Product updated successfully",
      id: updatedProduct,
    });
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const productId = Array.isArray(req.params.productId)
      ? req.params.productId[0]
      : req.params.productId;
    if (!productId) {
      return next(createHttpError(400, "Product id is required"));
    }

    const product = await this.productService.getProduct(productId);

    if (!product) {
      return next(
        createHttpError(404, "Product not found for this product id"),
      );
    }
    const userTenantId = (req as AuthRequest).auth?.tenantId;
    const userRole = (req as AuthRequest).auth.role;
    if (
      userRole !== "admin" &&
      product?.tenantId.trim() !== String(userTenantId)
    ) {
      return next(
        createHttpError(503, "You are not allow to access this product"),
      );
    }
    const productImage = product.image;
    if (productImage) {
      await this.storageService.delete(productImage);
    }
    await this.productService.deleteProduct(productId);
    this.logger.info("Product deleted successfully", {
      id: productId,
    });

    res.json({
      message: "Product deleted successfully",
      id: productId,
    });
  };

  getProdctList = async (req: Request, res: Response) => {
    const { q, tenantId, categoryId, isPublish, limit, page } = req.query;
    const filters: ProductFilter = {};

    if (isPublish === "true") {
      filters.isPublish = true;
    }
    if (tenantId) {
      filters.tenantId = tenantId as string;
    }
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId as string)) {
      // we add new mongoose query to convert normal string id to ObjectId(string id) same as in mongodb for filter
      filters.categoryId = new mongoose.Types.ObjectId(categoryId as string);
    }

    const products = await this.productService.getProducts(
      q as string,
      filters,
      {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      },
    );
    this.logger.info("Products fetched");
    res.json(products);
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    const productId = Array.isArray(req.params.productId)
      ? req.params.productId[0]
      : req.params.productId;
    if (!productId) {
      return next(createHttpError(400, "Product id is required"));
    }

    const product = await this.productService.getProduct(productId);

    if (!product) {
      return next(
        createHttpError(404, "Product not found for this product id"),
      );
    }
    this.logger.info("Product details are fetched", { id: productId });
    res.json(product);
  };
}
