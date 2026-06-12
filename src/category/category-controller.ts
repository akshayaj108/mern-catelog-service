import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Category } from "./category-types";
import { CategoryService } from "./category-service";
import { Logger } from "winston";
import mongoose from "mongoose";
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: Logger,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      next(createHttpError(400, results.array()[0]?.msg as string));
    }
    const { name, priceConfiguration, attributes } = req.body as Category;

    const category = await this.categoryService.create({
      name,
      priceConfiguration,
      attributes,
    });
    this.logger.info("Category is created", { id: category._id });
    res.json({ id: category._id });
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid category id"));
    }
    const results = validationResult(req);
    if (!results.isEmpty()) {
      return next(createHttpError(400, results.array()[0]?.msg as string));
    }

    const categoryData = req.body as Category;

    const existingCategoryData = await this.categoryService.getOne(id);

    if (!existingCategoryData) {
      return next(createHttpError(404, "Category not found"));
    }

    if (categoryData.priceConfiguration) {
      const existingConfig =
        existingCategoryData?.priceConfiguration instanceof Map
          ? Object.fromEntries(existingCategoryData.priceConfiguration)
          : existingCategoryData.priceConfiguration;
      //mergeConfiguration
      const mergedConfig = {
        ...existingConfig,
        ...categoryData.priceConfiguration,
      };
      categoryData.priceConfiguration = mergedConfig;
    }

    const response = await this.categoryService.update(id, categoryData);
    this.logger.info("Category is updated successfully", { id });
    res.json(response);
  };
}
