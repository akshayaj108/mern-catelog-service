import { body } from "express-validator";

export default [
  body("name")
    .exists()
    .withMessage("Product name is a required")
    .isString()
    .withMessage("Product name should be a string"),

  body("price").exists().withMessage("Price is required"),

  // body("image").custom((value, { req }) => {
  //   if (!req.files) {
  //     throw new Error("Product image is required");
  //   }
  //   return true;
  // }),

  body("tenantId").exists().withMessage("Tenant Id field is required"),
];
