import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Category } from "./category-types";
import { CategoryService } from "./category-service";
import { Logger } from "winston";

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
  get = async (req: Request, res: Response) => {
    const results = await this.categoryService.getAll();
    this.logger.info("All categories fetched");
    res.json(results);
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    if (!categoryId) {
      return next(createHttpError(400, "Category id is required"));
    }
    const category = await this.categoryService.getOne(categoryId);
    if (!category) {
      return next(createHttpError(404, "Category not found"));
    }
    this.logger.info("Category details fetched", { id: categoryId });
    res.json(category);
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      return next(createHttpError(400, results.array()[0]?.msg as string));
    }
    const categoryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    if (!categoryId) {
      return next(createHttpError(400, "Category id is required"));
    }
    const categoryData = req.body as Category;

    const existingCategoryData = await this.categoryService.getOne(categoryId);

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

    const response = await this.categoryService.update(
      categoryId,
      categoryData,
    );
    this.logger.info("Category is updated successfully", { id: categoryId });
    res.json(response);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    if (!categoryId) {
      return next(createHttpError(400, "Category id is required"));
    }
    const isCateoryExist = await this.categoryService.getOne(categoryId);
    if (!isCateoryExist) {
      return next(createHttpError(404, "Category not found"));
    }
    await this.categoryService.delete(categoryId);
    this.logger.info("Categor deleted successfully", { id: categoryId });
    res.json({
      id: categoryId,
    });
  };
}
