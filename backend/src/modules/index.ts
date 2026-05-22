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
import { statsRouter } from "./stats-data/stats.router";
import { assetTypeRouter } from "./asset-type/type.router";
import { inquiryRouter } from "./inquiry/inquiry.router";

const s = initServer();

export const router = s.router(contract, {
  asset: assetRouter,
  atype: assetTypeRouter,
  attendance: attendanceRouter,
  auth: authRouter,
  billing: billingRouter,
  business: businessRouter,
  log: logRouter,
  inquiry: inquiryRouter,
  payment: paymentRouter,
  service: serviceRouter,
  stats: statsRouter,
  user: userRouter,
});