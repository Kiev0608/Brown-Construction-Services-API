// src/middleware/auth.js
export const authenticate = () => (req, res, next) => {
  // In future: verify Firebase token here
  req.user = { uid: "testUser123", role: "client" };
  next();
};
