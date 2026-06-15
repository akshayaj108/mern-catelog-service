import toppingModel from "./topping-model";
import { Topping, ToppingFilter } from "./topping-types";
import { PaginateQuery } from "../common/types/index";
import { customPaginationLabels } from "../config/paginationsLabel";

export class ToppingService {
  create = async (toppingData: Topping): Promise<Topping> => {
    return (await toppingModel.create(toppingData)) as Topping;
  };

  update = async (
    toppingId: string,
    toppingData: Topping,
  ): Promise<Topping> => {
    return (await toppingModel.findByIdAndUpdate(toppingId, toppingData, {
      returnDocument: "after",
      runValidators: true,
    })) as Topping;
  };

  getTopping = async (toppingId: string): Promise<Topping> => {
    return (await toppingModel.findById(toppingId)) as Topping;
  };

  getAllToping = async (
    q: string,
    filters: ToppingFilter,
    paginateQuery: PaginateQuery,
  ) => {
    const searchContext = new RegExp(q, "i");
    const matchQuery = {
      ...filters,
      name: searchContext,
    };
    const aggregate = toppingModel.aggregate([
      {
        $match: matchQuery,
      },
    ]);
    return await toppingModel.aggregatePaginate(aggregate, {
      ...paginateQuery,
      customLabels: customPaginationLabels,
    });
  };

  deleteTopping = async (toppingId: string): Promise<Topping> => {
    return (await toppingModel.findByIdAndDelete(toppingId)) as Topping;
  };
}
