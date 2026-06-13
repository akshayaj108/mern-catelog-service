import { body } from "express-validator";

export default [
  body("name")
    .exists()
    .withMessage("Product name is a required")
    .isString()
    .withMessage("Product name should be a string"),

  body("descriptions").exists().withMessage("Descriptions is required"),

  // body("image").custom((value, { req }) => {
  //   if (!req.files) {
  //     throw new Error("Product image is required");
  //   }
  //   return true;
  // }),

  body("priceConfiguration")
    .exists()
    .withMessage("Price configuration is required"),
  body("attributes").exists().withMessage("Attributes field is required"),
  body("tenantId").exists().withMessage("Tenant Id field is required"),
  body("categoryId").exists().withMessage("Category Id field is required"),

  //   body("priceConfiguration.*.priceType")
  //     .exists()
  //     .withMessage("Price type is required")
  //     .custom((value: "base" | "additional") => {
  //       const validKeys = ["base", "additional"];
  //       if (!validKeys.includes(value)) {
  //         throw new Error(
  //           `${value} is invalid attribute for price type field. Possible values are: [${validKeys.join(",")}]`,
  //         );
  //       }
  //       return true;
  //     }),

  //   body("attributes.*.name").exists().withMessage("Attributes name is required"),
  //   body("attributes.*.weightType")
  //     .exists()
  //     .withMessage("Attributes weight type is required")
  //     .custom((value: "switch" | "radio") => {
  //       const validKeys = ["switch", "radio"];
  //       if (!validKeys.includes(value)) {
  //         throw new Error(
  //           `${value} is invalid attribute for weight type field. Possible values are: [${validKeys.join(",")}`,
  //         );
  //       }
  //       return true;
  //     }),
];
