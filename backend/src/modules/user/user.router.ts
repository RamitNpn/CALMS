import { initServer } from "@ts-rest/express";

import { userContract } from "../../contract/users/user.contract";
import { userQueryHandler } from "./user.query";
import { userMutationHandler } from "./user.mutation";

import { userUploadFields } from "../../middleware/upload-fields";

const s = initServer();

export const userRouter = s.router(userContract, {
  getAllUsers: userQueryHandler.getAllUsers,

  getUserByID: userQueryHandler.getUserByID,

  createUser: {
    middleware: [userUploadFields],
    handler: userMutationHandler.createUser,
  },

  updateUser: {
    middleware: [userUploadFields],
    handler: userMutationHandler.updateUser,
  },

  removeUser: userMutationHandler.removeUser,
});