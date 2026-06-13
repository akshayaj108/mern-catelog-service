import mongoose from "mongoose";
import { Attributes, Category, PriceConfiguration } from "./category-types";

const priceConfigurationModel = new mongoose.Schema<PriceConfiguration>({
  priceType: {
    type: String,
    enum: ["base", "additional"],
    required: true,
  },
  availableOptions: {
    type: [String],
    required: true,
  },
});
const attributeScema = new mongoose.Schema<Attributes>({
  name: {
    type: String,
    required: true,
  },
  weightType: {
    type: String,
    enum: ["switch", "radio"],
    required: true,
  },
  defaultValue: {
    type: String,
    required: true,
  },
  availableOptions: {
    type: [String],
    required: true,
  },
});
const categorySchema = new mongoose.Schema<Category>(
  {
    name: {
      type: String,
      required: true,
    },
    priceConfiguration: {
      type: Map,
      of: priceConfigurationModel,
      required: true,
    },
    attributes: {
      type: [attributeScema],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
