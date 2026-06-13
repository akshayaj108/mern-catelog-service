import productModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
  create = async (productData: Product) => {
    return await productModel.create(productData);
  };

  getProductImage = async (productId: string) => {
    const product = await productModel.findById(productId);
    return product?.image;
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
