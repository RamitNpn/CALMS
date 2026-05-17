import { AppRouteQueryImplementation } from "@ts-rest/express";
import { activityLogContract } from "../../contract/activity-log/activity-log.contract";
import activityLogRepository from "../../repository/activity-log.repository";

export const getActivityLogs: AppRouteQueryImplementation<
  typeof activityLogContract.getActivityLogs
> = async ({ query }) => {
  try {
    const {
      module,
      page = 1,
      limit = 10,
      userId,
      recordId,
    } = query as any;

    console.log("Fetching logs for module:", module);

    const skip = (page - 1) * limit;

    const { data, total } = await activityLogRepository.getByModule(
      module,
      skip,
      limit,
      { userId, recordId }
    );

    const totalPages = Math.ceil(total / limit);

    return {
      status: 200,
      body: {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error while fetching logs:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Error while fetching logs records",
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      },
    };
  }
};

export const activityLogQueryHandler = {
  getActivityLogs,
};
