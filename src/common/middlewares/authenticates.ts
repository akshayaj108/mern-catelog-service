import { expressjwt } from "express-jwt";
import jwksClient from "jwks-rsa";
import config from "config";
import { Request } from "express";

export default expressjwt({
  secret: jwksClient.expressJwtSecret({
    jwksUri: config.get("auth.jwksUri"),
    cache: true,
    rateLimit: true,
  }),
  algorithms: ["RS256"],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (token) {
      return token;
    }

    const { accessToken } = req.cookies;
    if (typeof accessToken === "string") {
      return accessToken;
    }
    return undefined;
  },
});
