// #
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./database");

// #
const app = express();
app.use(express.json());
app.use(cors());

// --

const STATUS_SERVER_ERROR = 500;
const serverErrorResponse = () => sendResponse(res, STATUS_SERVER_ERROR, "Server error.");

const secretTokenKey = "tempSecretKey";

// #
function sendResponse(res, statusCode, message) {
  res.status(statusCode).send(message);
}

async function queryDatabase(sqlQuery, userInputArr){
    try{        
        const response = await pool.query(sqlQuery, userInputArr);
        
        return response;
    }catch(err){
        console.error(err);
        serverErrorResponse();
        return false;
    }
}

// used by /user/register endpoint
async function doesRegUsernameAndEmailExist(username, email, res){
    const usernameResponse = await queryDatabase("SELECT 1 FROM users WHERE username = $1", [username]);
    const emailResponse = await queryDatabase("SELECT 1 FROM users WHERE email = $1", [email]);

    if(!usernameResponse || !emailResponse){ 
        sendResponse(res, 500, "Database query failed");
        return false;
    }

    if(usernameResponse.rowCount > 0){
        sendResponse(res, 400, "Username already exists.");
        return false;
    }

    if(emailResponse.rowCount > 0) {
        sendResponse(res, 400, "Email already exists.");
        return false;
    }

    return true;
}

// used by /user/register endpoint
async function registerUser(username, email, hashedPassword, res){
    const insertResponse = await queryDatabase("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", [username, email, hashedPassword]);

    if(!insertResponse){ 
        sendResponse(res, 500, "Database query failed");
        return;
    }

    sendResponse(res, 201, "User was successfully created.");
}

// used by /user/register endpoint
async function hashPassword(password, salt){
     try{
        // #
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (err){
        console.error(err);
        serverErrorResponse();
        return false;
    }
}


function isPasswordValid(password, confirmPassword, res) {
    confirmPassword = confirmPassword ? password : confirmPassword;

    const MIN_PASSWORD_LEN = 10;
    const specialCharRegexPattern = /[^a-zA-Z0-9]/;
    const numberRegexPattern = /\d/;

    const hasNumber = numberRegexPattern.test(password);
    const hasSpecialChar = specialCharRegexPattern.test(password);

    let isValid = true;

    if(!password){
        sendResponse(res, 400, "No password");
        isValid = false;
    }else if(!confirmPassword){
        sendResponse(res, 400, "No confirm password");
        isValid = false;
    }  else if(password.length < MIN_PASSWORD_LEN) {
        sendResponse(res, 400, `Password too short, minimum length must be ${MIN_PASSWORD_LEN} NOT ${password.length}.`);
        isValid = false;
    }else if (password !== confirmPassword) {
        sendResponse(res, 400, "Passwords do not match.");
        isValid = false;
    }else if (!hasSpecialChar) {
        sendResponse(res, 400, "Password needs at least one special character.");
        isValid = false;
    }else if (!hasNumber) {
        sendResponse(res, 400, "Password needs at least one number.");
        isValid = false;
    }

    return isValid;
}

function isEmailValid(email, res) {
    const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isEmailValid = emailRegexPattern.test(email);

    if(!email){
        sendResponse(res, 400, "No email.");
        return false;
    }

    if(!isEmailValid){
        sendResponse(res, 400, "Email invalid");
        return false;
    }

    return true;
}


function isUsernameValid(username, res){
    const MIN_USERNAME_LEN = 3;

    if(!username){
        sendResponse(res, 400, "No username.");
        return false;
    }

    if(username.length <= MIN_USERNAME_LEN){
        sendResponse(res, 400, `Username too short, minimum length must be ${MIN_USERNAME_LEN} NOT ${username.length}.`);
        return false;
    }
    
    return true;
}


// used by /user/login endpoint
async function loginCheckUsernameExists(username, res){
        const usernameResponse = await queryDatabase("SELECT 1 FROM users WHERE username = $1", [username]);

        if(!usernameResponse){ 
            sendResponse(res, 500, "Database query failed");
            return false;
        }

        if(usernameResponse.rowCount === 0){
            sendResponse(res, 404, "Username does not exist.");
            return false;
        } 


    return true;
}

// used by /user/login endpoint
async function loginCheckPasswordMatch(username, password, res){
    const passwordResponse = await queryDatabase("SELECT password FROM users WHERE username = $1",[username]);

    if(!passwordResponse){ 
        sendResponse(res, 500, "Database query failed");
        return false;
    }

    if(passwordResponse.rowCount === 0){
        sendResponse(res, 404, "Password does not exist.");
        return false;
    }

    const hashedPasswordFromDB = passwordResponse.rows[0].password;

    try{
        const doesPasswordMatch = await bcrypt.compare(password, hashedPasswordFromDB);

        if(!doesPasswordMatch){
            sendResponse(res, 400, "Incorrect password.");
            return false;
        }
    }catch(err){
        console.error(err);
        serverErrorResponse();
        return false;
    }

    return true;
}

// used by /user/login endpoint
async function loginUser(username, res){
    const userIDresponse = await queryDatabase("SELECT id FROM users WHERE username = $1",[username]);

    if(!userIDresponse){ 
        sendResponse(res, 500, "Database query failed");
        return;
    }

    if(userIDresponse.rowCount === 0){
        sendResponse(res, 404, "Username does not exist.");
        return;
    }

    const userId = userIDresponse.rows[0].id;
    const accessToken = jwt.sign({ id: userId }, secretTokenKey, {expiresIn:"1hr"});

    sendResponse(res, 200, {username: username, token: accessToken});
}

// used by /user endpoint
function decodeToken(req, res){
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        sendResponse(res, 401, "Token missing.");
        return;
    }

    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        sendResponse(res, 401, "Token missing.");
        return;
    }

    try{
        const decoded = jwt.verify(token, secretTokenKey);

        return decoded;
    } catch(err){
        console.error(err)
        sendResponse(res, 401, "Token verification failed.");

    }
}

// used by /user endpoint
async function sendUserData(userID, res){
    const response = await queryDatabase("SELECT * FROM users WHERE id = $1", [userID]);

    if(!response) {
        sendResponse(res, 500, "Database query failed");
        return;
    }

    const userData = response.rows[0];

    sendResponse(res, 200, userData);
}




// -------------------------------------------------------------------------

// #
app.post("/user/register", async (req, res) => {
    // #
    const {username, email, password, confirmPassword} = req.body;

    const SALT_ROUNDS = 10;

    if(!isUsernameValid(username, res)) return;
    if(!isEmailValid(email, res)) return;
    if(!isPasswordValid(password, confirmPassword, res)) return;

    const isValid = await doesRegUsernameAndEmailExist(username, email, res);
    if(!isValid) return;

    const hashedPassword = await hashPassword(password, SALT_ROUNDS);
    if(!hashedPassword) return;

    await registerUser(username, email, hashedPassword, res);
});


// #
app.post("/user/login", async (req, res) => {
    const {username, password} = req.body;

    if(!isUsernameValid(username, res)) return;
    if(!isPasswordValid(password, res)) return;

    const doesUserNameExists = await loginCheckUsernameExists(username, res);

    if(!doesUserNameExists) return;


    const doesPasswordMatch = await loginCheckPasswordMatch(username, password, res);

    if(!doesPasswordMatch) return;
    

    await loginUser(username, res);
})


// #
app.get("/user", async (req, res) => {
    const decoded = decodeToken(req, res);
    const userID = decoded.id;

    await sendUserData(userID, res);
});

// --

app.post("/verify", (req, res) => {
    const decoded = decodeToken(req, res);

    if (!decoded) return; 

    sendResponse(res, 200, "Token is valid");
});


// #
const PORT_NUM = 5000;

app.listen(PORT_NUM, () => {
    console.log(`Server has started on port ${PORT_NUM}`)
})

module.exports = app;