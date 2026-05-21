import env from "../config/env";
import { authRepository } from "../repository/auth.repository";

export const requireAuthMiddleware = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authorization token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = authRepository.verifyJwtToken(token, env.JWT_SECRET) as {
      userId: string;
    };

    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};
