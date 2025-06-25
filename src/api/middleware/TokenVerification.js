import jwt from "jsonwebtoken";

export const verifyAdminToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(403)
      .json({ sucess: false, message: "No token provided." });
  }

  jwt.verify(token, process.env.ADMIN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ sucess: false, message: "Failed to authenticate token." });
    }
    if (decoded.role != "Admin" && decoded.role != "SubAdmin") {
      return res
        .status(403)
        .json({ sucess: false, message: "Access denied. Admins only." });
    }
    req.admin = decoded;
    next();
  });
};


// for user 
export const userAuth = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        if (!token) return res.status(401).json({ success: false, message: "JWT token is required", isAuthorized: false });

        if (token.startsWith("Bearer ")) token = token.slice(7);

        let decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decodeToken);

        req.userId = decodeToken?.userId; // Pass userId for further use
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "JWT token has expired", isAuthorized: false });
        }
        return res.status(400).json({ success: false, message: "Invalid JWT token", isAuthorized: false });
    }
};