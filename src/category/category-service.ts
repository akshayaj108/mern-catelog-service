import categoryModel from "./category-model";
import { Category } from "./category-types";

export class CategoryService {
  create = async (categoryData: Category) => {
    const category = new categoryModel(categoryData);
    return category.save();
  };

  getAll = async () => {
    return await categoryModel.find();
  };
  getOne = async (id: string) => {
    return await categoryModel.findById(id);
  };
  update = async (categoryId: string, categoryData: Category) => {
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      categoryId,
      categoryData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    return updatedCategory;
  };

  delete = async (id: string) => {
    return await categoryModel.findByIdAndDelete(id);
  };
}
