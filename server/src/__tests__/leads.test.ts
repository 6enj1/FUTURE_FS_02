import { describe, it, expect, beforeAll } from "vitest";
import { getAuthToken, authRequest } from "./helpers.js";

let token: string;
let api: ReturnType<typeof authRequest>;
let leadId: string;

beforeAll(async () => {
  token = await getAuthToken();
  api = authRequest(token);
});

describe("POST /api/leads", () => {
  it("creates a lead", async () => {
    const res = await api.post("/api/leads", {
      name: "Test Lead",
      email: "lead@test.com",
      phone: "555-1234",
      source: "Website Contact Form",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Test Lead");
    expect(res.body.data.status).toBe("NEW");
    leadId = res.body.data.id;
  });

  it("validates required fields", async () => {
    const res = await api.post("/api/leads", { name: "" });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/leads", () => {
  it("lists leads with pagination", async () => {
    const res = await api.get("/api/leads");
    expect(res.status).toBe(200);
    expect(res.body.data.items).toBeDefined();
    expect(res.body.data.total).toBeGreaterThan(0);
    expect(res.body.data.page).toBe(1);
  });

  it("filters by status", async () => {
    const res = await api.get("/api/leads?status=NEW");
    expect(res.status).toBe(200);
    for (const item of res.body.data.items) {
      expect(item.status).toBe("NEW");
    }
  });

  it("searches by name", async () => {
    const res = await api.get("/api/leads?search=Test Lead");
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
  });
});

describe("GET /api/leads/:id", () => {
  it("returns lead with notes and follow-ups", async () => {
    const res = await api.get(`/api/leads/${leadId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(leadId);
    expect(res.body.data.notes).toBeDefined();
    expect(res.body.data.followUps).toBeDefined();
  });

  it("returns 404 for unknown id", async () => {
    const res = await api.get("/api/leads/00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/leads/:id", () => {
  it("updates status and sets lastContactedAt", async () => {
    const res = await api.patch(`/api/leads/${leadId}`, {
      status: "CONTACTED",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("CONTACTED");
    expect(res.body.data.lastContactedAt).toBeTruthy();
  });
});

describe("Notes and Follow-ups", () => {
  it("creates a note", async () => {
    const res = await api.post(`/api/leads/${leadId}/notes`, {
      body: "Test note content",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.body).toBe("Test note content");
  });

  it("lists notes", async () => {
    const res = await api.get(`/api/leads/${leadId}/notes`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  let followUpId: string;

  it("creates a follow-up", async () => {
    const res = await api.post(`/api/leads/${leadId}/followups`, {
      dueAt: new Date(Date.now() + 86400000).toISOString(),
      note: "Call back tomorrow",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.note).toBe("Call back tomorrow");
    followUpId = res.body.data.id;
  });

  it("marks follow-up as complete", async () => {
    const res = await api.patch(`/api/followups/${followUpId}`, {
      completedAt: new Date().toISOString(),
    });
    expect(res.status).toBe(200);
    expect(res.body.data.completedAt).toBeTruthy();
  });
});

describe("DELETE /api/leads/:id", () => {
  it("deletes lead and related data", async () => {
    const res = await api.delete(`/api/leads/${leadId}`);
    expect(res.status).toBe(204);

    const check = await api.get(`/api/leads/${leadId}`);
    expect(check.status).toBe(404);
  });
});
