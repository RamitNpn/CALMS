import { initServer } from "@ts-rest/express";
import { activityLogContract } from "../../contract/activity-log/activity-log.contract";
import { activityLogMutationHandler } from "./activity-log.mutation";
import { activityLogQueryHandler } from "./activity-log.query";

const s = initServer();

export const logRouter = s.router(activityLogContract, {
    removeLogs: activityLogMutationHandler.removeLogs,
    getActivityLogs: activityLogQueryHandler.getActivityLogs
});
