import { body } from "express-validator";

export default [
  body("name")
    .exists()
    .withMessage("category name i required")
    .isString()
    .withMessage("Category name should be a string"),

  body("priceConfiguration")
    .exists()
    .withMessage("Price configuration is required"),
  body("priceConfiguration.*.priceType")
    .exists()
    .withMessage("Price type is required")
    .custom((value: "base" | "additional") => {
      const validKeys = ["base", "additional"];
      if (!validKeys.includes(value)) {
        throw new Error(
          `${value} is invalid attribute for price type field. Possible values are: [${validKeys.join(",")}]`,
        );
      }
      return true;
    }),

  body("attributes").exists().withMessage("Attributes field is required"),
  body("attributes.*.name").exists().withMessage("Attributes name is required"),
  body("attributes.*.weightType")
    .exists()
    .withMessage("Attributes weight type is required")
    .custom((value: "switch" | "radio") => {
      const validKeys = ["switch", "radio"];
      if (!validKeys.includes(value)) {
        throw new Error(
          `${value} is invalid attribute for weight type field. Possible values are: [${validKeys.join(",")}`,
        );
      }
      return true;
    }),
  body("attributes.*.defaultValue")
    .exists()
    .withMessage("Default value is required"),
];
