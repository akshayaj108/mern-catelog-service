import mongoose from "mongoose";

export interface Topping {
  _id?: mongoose.Schema.Types.ObjectId;
  name: string;
  image: string;
  price: string;
  tenantId: string;
  isPublish: boolean;
}
