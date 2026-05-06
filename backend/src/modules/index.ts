import { initServer } from "@ts-rest/express";

import { contract } from "../contract";

import { assetRouter } from "./asset/asset.router";
import { attendanceRouter } from "./attendance/attendance.router";
import { scheduleRouter } from "./schedule/schedule.router";
import { tokenRouter } from "./token/token.router";
import { businessRouter } from "./business/business.router";
import { billingRouter } from "./billing/billing.router";
import { userRouter } from "./user/user.router";
import { authRouter } from "./auth/auth.router";

const s = initServer();

export const router = s.router(contract, {
  asset: assetRouter,
  attendance: attendanceRouter,
  auth: authRouter,
  billing: billingRouter,
  business: businessRouter,
  schedule: scheduleRouter,
  token: tokenRouter,
  user: userRouter,
});