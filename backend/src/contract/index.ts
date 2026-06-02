import { initContract } from "@ts-rest/core";
import { assetContract } from "./asset/asset.contract";
import { attendanceContract } from "./attendance/attendance.contract";
import { businessContract } from "./business/business.contract";
import { billingContract } from "./billing/billing.contract";
import { authContract } from "./auth/auth.contract";
import { paymentContract } from "./payment/payment.contract";
import { userContract } from "./user/user.contract";
import { serviceContract } from "./service/service.contract";
import { activityLogContract } from "./activity-log/activity-log.contract";
import { statsContract } from "./stats/stats.contract";
import { assetTypeContract } from "./asset-type/type.contract";
import { inquiryContract } from "./inquiry/inquiry.contract";
import { tokenContract } from "./token/token.contract";
import { financeContract } from "./finance/finance.contract";

const c = initContract();

export const contract = c.router({
    asset: assetContract,
    atype: assetTypeContract,
    attendance: attendanceContract,
    auth: authContract,
    billing: billingContract,
    business: businessContract,
    finance: financeContract,
    inquiry: inquiryContract,
    log: activityLogContract,
    payment: paymentContract,
    service: serviceContract,
    stats: statsContract,
    token: tokenContract,
    user: userContract,
});
