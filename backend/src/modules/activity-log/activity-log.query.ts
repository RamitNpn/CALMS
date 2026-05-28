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
      action,
    } = query as any;

    const skip = (Number(page) - 1) * Number(limit);

    const { data, total } = await activityLogRepository.getLogs(
      skip,
      Number(limit),
      {
        module,
        userId,
        recordId,
        action,
      }
    );

    const totalPages = Math.ceil(total / Number(limit));

    return {
      status: 200,
      body: {
        success: true,
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
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
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
    };
  }
};

export const activityLogQueryHandler = {
  getActivityLogs,
};