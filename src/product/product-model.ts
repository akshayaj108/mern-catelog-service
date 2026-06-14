import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const priceConfigurationSchema = new mongoose.Schema({
  priceType: {
    type: String,
    enum: ["base", "additional"],
  },
  availableOptions: {
    type: Map,
    of: Number,
  },
});

const attributesSchema = new mongoose.Schema({
  name: String,
  value: mongoose.Schema.Types.Mixed,
});
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    descriptions: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    priceConfiguration: {
      type: Map,
      of: priceConfigurationSchema,
    },
    attributes: [attributesSchema],
    tenantId: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    isPublish: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true },
);

//pagination we using third party library in mongodb
productSchema.plugin(mongooseAggregatePaginate);
export default mongoose.model("Product", productSchema);
