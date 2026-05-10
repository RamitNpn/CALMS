import { AppRouteMutationImplementation } from "@ts-rest/express";
import { authContract } from "../../contract/auth/auth.contract";
import bcrypt from "bcryptjs";
import env from "../../config/env";
import businessRepository from "../../repository/business.repository";
import userRepository from "../../repository/user.repository";
import { authRepository } from "../../repository/auth.repository";

export const authLogin: AppRouteMutationImplementation<
  typeof authContract.login
> = async ({ req }) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const businessUser = await businessRepository.getByEmail(normalizedEmail);
    const user = await userRepository.getByEmail(normalizedEmail);
    const account = businessUser || user;
    console.log(account);
    if (!account) {
      return {
        status: 404,
        body: { success: false, error: "User not found" },
      };
    }

    // 3. narrow type safely
    const isBusiness = "operatorPassword" in account;
    const passwordHash = isBusiness
      ? account.operatorPassword
      : account.userPassword;

    const role = isBusiness ? account.role : account.role;

    const userName = isBusiness ? account.operatorName : account.userName;

    const userEmail = isBusiness ? account.operatorEmail : account.userEmail;

    const services = isBusiness ? account.services : "";

    const business_id = isBusiness ? account._id : account.business_id;

    // 4. verify password
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!isPasswordValid) {
      return {
        status: 401,
        body: { success: false, error: "Invalid credentials" },
      };
    }

    // 5. create token
    const token = authRepository.createJwtToken(
      {
        userId: account._id.toString(),
      },
      env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      status: 200,
      body: {
        id: account._id.toString(),
        business_id,
        userName,
        userEmail,
        role,
        token,
        services,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Internal server error",
      },
    };
  }
};

export const verifySetupToken: AppRouteMutationImplementation<
  typeof authContract.verifySetupToken
> = async ({ req }) => {
  try {
    const { token } = req.body;

    // Verify the JWT token
    const decoded = authRepository.verifyJwtToken(token, env.JWT_SECRET);

    if (typeof decoded === "string") {
      return {
        status: 401,
        body: { success: false, error: "Invalid token" },
      };
    }

    // Check if token is a setup token (has setupToken claim)
    if (!decoded.setupToken) {
      return {
        status: 401,
        body: { success: false, error: "Invalid token type" },
      };
    }

    const accountId = decoded.accountId as string;

    // Find account by ID
    let account = await businessRepository.getByID(accountId);

    if (!account) {
      account = await userRepository.getByID(accountId);
    }

    if (!account) {
      return {
        status: 404,
        body: { success: false, error: "Account not found" },
      };
    }

    // Check if account already has password set (empty string means not set)
    const isBusiness = "operatorPassword" in account;
    const hasPassword = isBusiness
      ? account.operatorPassword && account.operatorPassword.length > 0
      : account.userPassword && account.userPassword.length > 0;

    if (hasPassword) {
      return {
        status: 400,
        body: { success: false, error: "Account already has a password set" },
      };
    }

    const accountName = isBusiness ? account.operatorName : account.userName;
    const accountEmail = isBusiness ? account.operatorEmail : account.userEmail;

    return {
      status: 200,
      body: {
        success: true,
        message: "Token verified successfully",
        accountId,
        accountName,
        accountEmail,
      },
    };
  } catch (error: any) {
    console.error("Token verification error:", error);
    return {
      status: 401,
      body: {
        success: false,
        error: error.message || "Invalid or expired token",
      },
    };
  }
};

export const setPassword: AppRouteMutationImplementation<
  typeof authContract.setPassword
> = async ({ req }) => {
  try {
    const { token, password } = req.body;

    // Verify the JWT token
    const decoded = authRepository.verifyJwtToken(token, env.JWT_SECRET);

    if (typeof decoded === "string") {
      return {
        status: 401,
        body: { success: false, error: "Invalid token" },
      };
    }

    // Check if token is a setup token
    if (!decoded.setupToken) {
      return {
        status: 401,
        body: { success: false, error: "Invalid token type" },
      };
    }

    const accountId = decoded.accountId as string;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find account - try business first, then user
    const businessAccount = await businessRepository.getByID(accountId);
    
    if (businessAccount) {
      const updated = await businessRepository.update(accountId, {
        operatorPassword: hashedPassword,
      });

      if (!updated) {
        return {
          status: 500,
          body: {
            success: false,
            error: "Failed to update password",
          },
        };
      }
    } else {
      const userAccount = await userRepository.getByID(accountId);
      
      if (!userAccount) {
        return {
          status: 404,
          body: {
            success: false,
            error: "Account not found",
          },
        };
      }

      const updated = await userRepository.update(accountId, {
        userPassword: hashedPassword,
      });

      if (!updated) {
        return {
          status: 500,
          body: {
            success: false,
            error: "Failed to update password",
          },
        };
      }
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Password set successfully",
      },
    };
  } catch (error: any) {
    console.error("Set password error:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: error.message || "Internal server error",
      },
    };
  }
};

export const authMutationHandler = {
  authLogin,
  verifySetupToken,
  setPassword,
};
