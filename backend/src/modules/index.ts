import { initServer } from "@ts-rest/express";

import { contract } from "../contract";

import { assetRouter } from "./asset/asset.router";
import { attendanceRouter } from "./attendance/attendance.router";
import { businessRouter } from "./business/business.router";
import { billingRouter } from "./billing/billing.router";
import { userRouter } from "./user/user.router";
import { authRouter } from "./auth/auth.router";
import { paymentRouter } from "./payment/payment.router";
import { serviceRouter } from "./service/service.router";
import { logRouter } from "./activity-log/activity-log.router";

const s = initServer();

export const router = s.router(contract, {
  asset: assetRouter,
  attendance: attendanceRouter,
  auth: authRouter,
  billing: billingRouter,
  business: businessRouter,
  log: logRouter,
  payment: paymentRouter,
  service: serviceRouter,
  user: userRouter,
});