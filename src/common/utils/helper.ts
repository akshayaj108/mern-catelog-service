type ProductPriceConfigurationItem = {
  priceType: "base" | "additional";
  availableOptions: Map<string, number>;
};

type MappedProductPriceConfigurationItem = {
  priceType: "base" | "additional";
  availableOptions: Record<string, number>;
};
// built in object method
// export const mapPriceConfiguration = (
//   priceConfiguration: Map<string, ProductPriceConfigurationItem>,
// ) => {
//   return Object.fromEntries(
//     [...priceConfiguration].map(([key, value]) => [
//       key,
//       {
//         priceType: value.priceType,
//         availableOptions: Object.fromEntries(value.availableOptions),
//       },
//     ]),
//   );
// };

//without built in method
export const mapPriceConfiguration = (
  priceConfiguration: Map<string, ProductPriceConfigurationItem>,
) => {
  const result: Record<string, MappedProductPriceConfigurationItem> = {};

  for (const [key, value] of priceConfiguration) {
    result[key] = {
      priceType: value.priceType,
      availableOptions: {},
    };

    for (const [option, price] of value.availableOptions) {
      result[key].availableOptions[option] = price;
    }
  }

  return result;
};
