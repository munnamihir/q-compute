import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export function auth(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  // Support: "Bearer TOKEN" OR raw token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    res.status(401).json({ error: "Invalid token" });
  }
}
