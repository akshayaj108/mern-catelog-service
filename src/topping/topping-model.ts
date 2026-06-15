import mongoose from "mongoose";

const toppingScema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tenantId: {
    type: String,
    required: true,
  },
  isPublish: {
    type: Boolean,
    required: false,
  },
});

export default mongoose.model("Toping", toppingScema);
