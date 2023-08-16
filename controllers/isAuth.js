const jwt = require("jsonwebtoken");

module.exports = (req, _res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    const error = new Error("Authorization headerî bulunamadı.");
    error.statusCode = 400;
    throw error; 
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKENSECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Kimlik doğrulanmadı.");
    error.statusCode = 401;
    throw error;
  }
  req.loggedUserId = decodedToken.userId;
  next();
};
