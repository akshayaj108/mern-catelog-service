export const Roles = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  MANAGER: "manager",
} as const;
//added as const to freeze ROLES obj

export enum EVENT_TYPE {
  PRODUCT_CREATE = "PRODUCT_CREATE",
  PRODUCT_UPDATE = "PRODUCT_UPDATE",
  PRODUCT_DELETE = "PRODUCT_DELETE",
  TOPPING_CREATE = "TOPPING_CREATE",
  TOPPING_UPDATE = "TOPPING_UPDATE",
  TOPPING_DELETE = "TOPPING_DELETE",
}
