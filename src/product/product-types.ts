import { PriceConfiguration } from "../category/category-types";

interface AttributesForProduct {
  name: string;
  value: string;
}
export interface Product {
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
