import { PaginateQuery } from "../common/types";
import { customPaginationLabels } from "../config/paginationsLabel";
import productModel from "./product-model";
import { Product, ProductFilter } from "./product-types";

export class ProductService {
  create = async (productData: Product) => {
    return (await productModel.create(productData)) as Product;
  };

  getProduct = async (productId: string) => {
    return (await productModel.findById(productId)) as Product;
  };

  upadte = async (productId: string, productData: Product) => {
    return (await productModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: productData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    )) as Product;
  };

  getProducts = async (
    q: string,
    filters: ProductFilter,
    paginateQuery: PaginateQuery,
  ) => {
    const serachText = new RegExp(q, "i");
    const matchQuery = {
      ...filters,
      name: serachText,
    };
    const aggregate = productModel.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                attributes: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$category",
      },
    ]);
    return productModel.aggregatePaginate(aggregate, {
      ...paginateQuery,
      customLabels: customPaginationLabels,
    });
  };
}
