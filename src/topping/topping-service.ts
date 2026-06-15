import toppingModel from "./topping-model";
import { Topping } from "./topping-types";

export class ToppingService {
  create = async (toppingData: Topping): Promise<Topping> => {
    return (await toppingModel.create(toppingData)) as Topping;
  };
}
