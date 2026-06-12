import categoryModel from "./category-model";
import { Category } from "./category-types";

export class CategoryService {
  create = async (categoryData: Category) => {
    const category = new categoryModel(categoryData);
    return category.save();
  };

  getOne = async (id: string) => {
    return await categoryModel.findById(id);
  };
  update = async (id: string, categoryData: Category) => {
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      categoryData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    return updatedCategory;
  };
}
