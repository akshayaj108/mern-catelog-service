import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Logger } from "winston";

export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly logger: Logger,
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
    const product = {
      name,
      descriptions,
      priceConfiguration: JSON.parse(priceConfiguration as string),
      attributes: JSON.parse(attributes as string),
      tenantId,
      categoryId,
      isPublish,
      image: "hghgg.jepg",
    };
    const newProduct = await this.productService.create(product);
    this.logger.info("Product is added", { id: newProduct._id });
    res.json({
      message: "Product created",
      id: newProduct._id,
    });
  };
}
