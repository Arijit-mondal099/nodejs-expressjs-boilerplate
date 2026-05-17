import supertest from "supertest";

import app from "@/app";

describe("Health check", () => {
  it("Should return 200 OK", async () => {
    const res = await supertest(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Server is healthy"
    });
  });
});
