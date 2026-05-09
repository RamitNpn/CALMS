// contracts/comment.contract.ts
import { initContract } from "@ts-rest/core";
import { assetContract } from "./asset/asset.contract";
import { attendanceContract } from "./attendance/attendance.contract";
import { scheduleContract } from "./schedule/schedule.contract";
import { tokenContract } from "./token/token.contract";
import { businessContract } from "./business/business.contract";
import { billingContract } from "./billing/billing.contract";
import { userContract } from "./users/user.contract";
import { authContract } from "./auth/auth.contract";
import { paymentContract } from "./payment/payment.contract";

const c = initContract();

export const contract = c.router({
    asset: assetContract,
    attendance: attendanceContract,
    auth: authContract,
    billing: billingContract,
    business: businessContract,
    payment: paymentContract,
    schedule: scheduleContract,
    token: tokenContract,
    user: userContract,
});
