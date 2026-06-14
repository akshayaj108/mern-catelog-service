import productModel from "./product-model";
import { Product } from "./product-types";

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
}
