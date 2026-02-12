import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("POST /api/auth/login", () => {
  it("returns token on valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "testpass123",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe("test@example.com");
  });

  it("returns 401 on wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 on unknown email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "testpass123",
    });

    expect(res.status).toBe(401);
  });

  it("returns 400 on missing fields", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });
});

describe("GET /api/auth/me", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
