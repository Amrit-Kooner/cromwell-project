const supertest = require("supertest");
const app = require("../server");
const pool = require("../database");

describe("user", () => {
  const loggedUserData = {username: "testuser",email: "test@example.com",password: "ValidPass1@",confirmPassword: "ValidPass1@"};
  let token;

  beforeAll(async () => {
    // Register user
    await supertest(app).post("/user/register").send(loggedUserData).expect(201);

    // Login to get token
    const res = await supertest(app).post("/user/login").send({username: loggedUserData.username,password: loggedUserData.password}).expect(200);
    
    token = res.body.token;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE username = $1", [loggedUserData.username]);
    await pool.end();
  });


  it("should reject invalid token", async () => {
    await supertest(app).get("/user").set("Authorization", "Bearer invalidtoken").expect(401);
  });

  it("should return user data with valid token", async () => {
    await supertest(app).get("/user").set("Authorization", `Bearer ${token}`).expect(200);
  });
});