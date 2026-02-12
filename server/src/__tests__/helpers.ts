import request from "supertest";
import app from "../app.js";

export async function getAuthToken(): Promise<string> {
  const res = await request(app).post("/api/auth/login").send({
    email: "test@example.com",
    password: "testpass123",
  });
  return res.body.data.token;
}

export function authRequest(token: string) {
  return {
    get: (url: string) =>
      request(app).get(url).set("Authorization", `Bearer ${token}`),
    post: (url: string, body: Record<string, unknown>) =>
      request(app)
        .post(url)
        .set("Authorization", `Bearer ${token}`)
        .send(body),
    patch: (url: string, body: Record<string, unknown>) =>
      request(app)
        .patch(url)
        .set("Authorization", `Bearer ${token}`)
        .send(body),
    delete: (url: string) =>
      request(app).delete(url).set("Authorization", `Bearer ${token}`),
  };
}
