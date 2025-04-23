// tests/security.test.js
const request = require("supertest");
const app = require("./server");
const db = require("./config/db");
describe("Security Tests", () => {
  let testToken;

  beforeAll(async () => {
    // Login to get valid token
    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@user.com", password: "validPassword123" });
    testToken = res.body.token;
  });

  test("SQL Injection protection", async () => {
    const response = await request(app)
      .get('/api/recipes?search=" OR 1=1 --')
      .set("Authorization", `Bearer ${testToken}`);
    expect(response.status).toBe(400);
  });

  test("XSS payload rejection", async () => {
    const response = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        name: '<script>alert("hacked")</script>',
        description: "Test",
      });
    expect(response.status).toBe(400);
  });
});
