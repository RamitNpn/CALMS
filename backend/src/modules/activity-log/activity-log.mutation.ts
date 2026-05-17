import { AppRouteMutationImplementation } from "@ts-rest/express";
import { activityLogContract } from "../../contract/activity-log/activity-log.contract";
import activityLogRepository from "../../repository/activity-log.repository";

export const removeLogs: AppRouteMutationImplementation<
  typeof activityLogContract.removeLogs
> = async ({ req }) => {
  try {
    const { _id, userId } = req.body;

    const result = await activityLogRepository.removeLogs(_id, userId);

    return {
      status: 200,
      body: {
        success: true,
        message: `Log removed successfully`,
        data: result,
      },
    };
  } catch (error) {
    console.error("Error while removing log:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const activityLogMutationHandler = {
  removeLogs,
};
