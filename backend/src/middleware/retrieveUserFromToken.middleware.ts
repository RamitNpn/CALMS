import env from "../config/env";
import { authRepository } from "../repository/auth.repository";
import userRepository from "../repository/user.repository";
import businessRepository from "../repository/business.repository";
import permissionRepository from "../repository/permission.repository";
import rolePermissionRepository from "../repository/role-permission.repository";

export const retrieveUserFromTokenMiddleware = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = authRepository.verifyJwtToken(token, env.JWT_SECRET) as {
      userId: string;
    };

    if (!decoded?.userId) {
      return next();
    }

    const business = await businessRepository.getByID(decoded.userId);
    if (business) {
      const permissions = await permissionRepository.getAllCodes();
      req.user = {
        id: decoded.userId,
        role: business.role as "admin" | "business" | "staff" | "client",
        permissions,
      };
      return next();
    }

    const user = await userRepository.getByID(decoded.userId);
    if (user) {
      let permissions: string[] = [];

      if (user.role === "staff") {
        const rolePermissions = user.staffRoleId
          ? await rolePermissionRepository.getAllowedCodes(user.staffRoleId.toString())
          : [];
        const directPermissions = Array.isArray(user.staffPermissions)
          ? user.staffPermissions
          : user.staffPermissions
          ? [user.staffPermissions]
          : [];

        permissions = Array.from(new Set([...rolePermissions, ...directPermissions]));
        if (permissions.length === 0) {
          permissions = ["staff_management:view"];
        }
      }

      req.user = {
        id: decoded.userId,
        role: user.role as "admin" | "business" | "staff" | "client",
        permissions,
      };
    }

    next();
  } catch (err) {
    console.error("Error in retrieveUserFromTokenMiddleware:", err);
    next();
  }
};
