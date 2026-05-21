import env from "../config/env";
import { authRepository } from "../repository/auth.repository";
import userRepository from "../repository/user.repository";

export const retrieveUserFromTokenMiddleware = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = authRepository.verifyJwtToken(token, env.JWT_SECRET) as {
      userId: string;
    };

    if (decoded?.userId) {
      const user = await userRepository.getByID(decoded.userId);

      if (user) {
        req.user = {
          id: decoded.userId,
          role: user.role as "admin" | "business" | "staff" | "client",
        };
      }
    }

    next();
  } catch (err) {
    console.error("Error in retrieveUserFromTokenMiddleware:", err);
    // Invalid token → just skip user, don't block
    next();
  }
};
