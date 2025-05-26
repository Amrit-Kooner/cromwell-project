const supertest = require("supertest");
const app = require("../server");
const pool = require("../database");

function createLoginData(username, password){
  return {username, password}
}

async function testEndpoint(data, expect){
    await supertest(app).post("/user/login").send(data).expect(expect);
}

describe("login", () => {
  const loggedUserData = {username:"loggedusername",email:"loggedemail@gmail.com",password:"loggedpassword1@",confirmPassword:"loggedpassword1@"};
  const randomUserData = createLoginData("randomusername", "randompassword1@");
  const inputNotEntered = undefined;

  beforeAll(async () => {
    await supertest(app).post("/user/register").send(loggedUserData);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE username = $1', [loggedUserData.username]);
    await pool.end();
  });

  it("successful login", async () => {
        const data = createLoginData(loggedUserData.username, loggedUserData.password);
        await testEndpoint(data, 200)
  });

  it("username does not exist", async () => {
        const data = createLoginData(randomUserData.username, loggedUserData.password);
        await testEndpoint(data, 404)
  });

  it("invalid password as it dont match with existing username", async () => {
        const data = createLoginData(loggedUserData.username, randomUserData.password);
        await testEndpoint(data, 400)
  });

  it("username too small", async() => {
    const data = createLoginData("xx", loggedUserData.password);
    await testEndpoint(data, 400)
  });

  it("username not entered", async() => {
    const data = createLoginData(inputNotEntered, loggedUserData.password);
    await testEndpoint(data, 400)
  });

  it("password not entered", async() => {
    const data = createLoginData(inputNotEntered, loggedUserData.password);
    await testEndpoint(data, 400)
  });
});


//username not enetred
//password not entered
