import categoryModel from "./category-model";
import { Category } from "./category-types";

export class CategoryService {
  create = async (categoryData: Category) => {
    const category = new categoryModel(categoryData);
    return category.save();
  };
}
