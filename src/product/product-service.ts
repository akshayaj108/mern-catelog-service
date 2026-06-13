import productModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
  create = async (productData: Product) => {
    return await productModel.create(productData);
  };
}
