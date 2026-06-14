import mongoose from "mongoose";
import { PriceConfiguration } from "../category/category-types";

interface AttributesForProduct {
  name: string;
  value: string;
}
export interface Product {
  _id?: mongoose.Schema.Types.ObjectId;
  name: string;
  descriptions: string;
  // todo: fix the price configuration type
  priceConfiguration: PriceConfiguration;
  attributes: AttributesForProduct[];
  tenantId: string;
  categoryId: string;
  image: string;
  isPublish: boolean;
}

export interface ProductFilter {
  tenantId?: string;
  categoryId?: mongoose.Types.ObjectId;
  isPublish?: boolean;
}
