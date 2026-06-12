export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
  };
}
export interface Attributes {
  name: string;
  weightType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}
export interface Category {
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attributes[];
}
