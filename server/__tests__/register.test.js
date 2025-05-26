const supertest = require("supertest");
const app = require("../server");
const pool = require("../database");


async function testEndpoint(data, expect) {
  await supertest(app).post("/user/register").send(data).expect(expect);
}

function createRegisterData(username, email, password, confirmPassword) {
  return { username, email, password, confirmPassword };
}

describe("register new user", () => {
  const takenUserData = createRegisterData("takenusername", "takenemail@gmail.com", "takenpassword1@", "takenpassword1@");
  const validUserData = createRegisterData("validusername", "validemail@gmail.com", "validpassword1@", "validpassword1@");
  const inputNotEntered = "";

  it("successfully registers user", async () => {
    await testEndpoint(takenUserData, 201);
  });

  it("passwords dont match", async () => {
    const data = createRegisterData(validUserData.username, validUserData.email, validUserData.password, takenUserData.password);
    await testEndpoint(data, 400);
  });

  it("username already exists", async () => {
    const data = createRegisterData(takenUserData.username, validUserData.email, validUserData.password, validUserData.confirmPassword);
    await testEndpoint(data, 400);
  });

  it("email already exists", async () => {
    const data = createRegisterData(validUserData.username, takenUserData.email, validUserData.password, validUserData.confirmPassword);
    await testEndpoint(data, 400);
  });

  it("email not in correct format", async () => {
    const data = createRegisterData(validUserData.username, "email.com", validUserData.password, validUserData.confirmPassword);
    await testEndpoint(data, 400);
  });

  it("no number in password", async () => {
    const data = createRegisterData(validUserData.username, validUserData.email, "password@@@@@", "password@@@@@");
    await testEndpoint(data, 400);
  });

  it("no special character in password", async () => {
    const data = createRegisterData(validUserData.username, validUserData.email, "password12345", "password12345");
    await testEndpoint(data, 400);
  });

  it("password too small", async () => {
    const data = createRegisterData(validUserData.username, validUserData.email, "small", "small");
    await testEndpoint(data, 400);
  });

  it("username too small", async () => {
    const data = createRegisterData("xx", validUserData.email, validUserData.password, validUserData.confirmPassword);
    await testEndpoint(data, 400);
  });

  it("username not entered", async () => {
    const data = createRegisterData(inputNotEntered, validUserData.email, validUserData.password, validUserData.confirmPassword);
    await testEndpoint(data, 400);
  });

  it("email not entered", async () => {
    const data = createRegisterData(validUserData.username, inputNotEntered, validUserData.password, validUserData.confirmPassword);
    await testEndpoint(data, 400);
  });

  it("password not entered", async () => {
    const data = createRegisterData(validUserData.username, validUserData.email, inputNotEntered, validUserData.confirmPassword);
    await testEndpoint(data, 400);
  });

  it("confirm not entered", async () => {
    const data = createRegisterData(validUserData.username, validUserData.email, validUserData.password, inputNotEntered);
    await testEndpoint(data, 400);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE username = $1', [takenUserData.username]);
    await pool.end();
  });
});


//username not enetred
//password not entered
//confirm password not entered
//email not entered
//.

