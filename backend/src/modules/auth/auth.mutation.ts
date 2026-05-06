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

export const authMutationHandler = {
  authLogin,
};
