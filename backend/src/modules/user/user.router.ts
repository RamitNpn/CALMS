import { initServer } from "@ts-rest/express";
import { userContract } from "../../contract/users/user.contract";
import { userQueryHandler } from "./user.query";
import { userMutationHandler } from "./user.mutation";

const s = initServer();

export const userRouter = s.router(userContract, {
  getAllUsers: userQueryHandler.getAllUsers,
  getUserByID: userQueryHandler.getUserByID,

  createUser: userMutationHandler.createUser,
  updateUser: userMutationHandler.updateUser,
  removeUser: userMutationHandler.removeUser,
});