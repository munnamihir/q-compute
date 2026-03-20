import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export function auth(req, res, next) {

  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
