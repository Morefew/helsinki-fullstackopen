import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method.toUpperCase());
  logger.info("Path:", req.path);

  if (req.body) {
    const sanitizedBody = { ...req.body };

    // Remove sensitive fields from logs
    if (sanitizedBody.password) sanitizedBody.password = "[REDACTED]";
    if (sanitizedBody.token) sanitizedBody.token = "[REDACTED]";
    if (sanitizedBody.passwordHash) sanitizedBody.passwordHash = "[REDACTED]";

    logger.info("Body:", sanitizedBody);
  } else {
    logger.info("Body:", req.body);
  }
  logger.info("---");
  next();
};

const unknownEndPoint = (req, res) => {
  res.status(404).send("Unknown endpoint");
};

const errorHandler = (err, req, res, next) => {
  logger.error("Request Error:", err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformed id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  } else if (
    err.name === "MongoServerError" &&
    err.message.includes("E11000 duplicate key error")
  ) {
    return res
      .status(400)
      .json({ error: "Resource already exists with this unique field" });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid authentication token" });
  } else if (err.name === "SyntaxError") {
    if (err.status === 400 && "body" in err) {
      return res.status(400).json({ error: "Invalid request format" });
    }
    return res.status(400).json({ error: "Syntax error in request" });
  }
  next(err);
};

const getTokenFrom = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    logger.error("NO TOKEN FOUND.");
    return res.status(401).json({ error: "Authentication Error" });
  }

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    req.user = await User.findById(decodedToken.id).select({username : 1, name:1, _id:1, blogs:1});
  } catch (error) {
    logger.error({"Token invalid": error.message});
    return res.status(401).json({ error: "Authentication Error" });
  }
  next();
};

export default {
  requestLogger,
  unknownEndPoint,
  errorHandler,
  getTokenFrom,
  userExtractor,
};
