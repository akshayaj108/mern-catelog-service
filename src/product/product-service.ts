import productModel from "./product-model";
import { Product, ProductFilter } from "./product-types";

export class ProductService {
  create = async (productData: Product) => {
    return await productModel.create(productData);
  };

  getProduct = async (productId: string) => {
    return await productModel.findById(productId);
  };

  upadte = async (productId: string, productData: Product) => {
    return await productModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: productData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  };

  getProducts = async (q: string, filters: ProductFilter) => {
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
    const results = await aggregate.exec();
    return results as Product[];
  };
}
