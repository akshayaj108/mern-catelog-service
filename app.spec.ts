/// <reference types="jest" />
import request from "supertest";
import app from "./src/app";

describe("test", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

describe("api integration test", () => {
  it("should return 200 status", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });
});
