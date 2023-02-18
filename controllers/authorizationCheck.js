const jwt = require("jsonwebtoken");

exports.authorizationCheck = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    const error = new Error("Authorization header is missing.");
    error.statusCode = 400;
    throw error; 
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    const error = new Error("Token is wrong! Please try to login again.");
    error.statusCode = 500;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  req.loggedUserId = decodedToken.userId;
  next();
};