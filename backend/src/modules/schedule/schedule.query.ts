import { AppRouteQueryImplementation } from "@ts-rest/express";
import { scheduleContract } from "../../contract/schedule/schedule.contract";
import scheduleRepository from "../../repository/schedule.repository";
import { title } from "node:process";

export const getAllSchedules: AppRouteQueryImplementation<
  typeof scheduleContract.getAllSchedules
> = async ({ req }) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { data: schedules, total } = await scheduleRepository.getAll(skip, limit);
    const totalPages = Math.ceil(total / limit);

    const formattedSchedules = schedules.map((s) => ({
      _id: s._id.toString(),
      tenantId: s.tenantId.toString(),
      title: s.title,
      staffId: s.staffId.toString(),
      clientId: s.clientId.toString(),
      startTime: s.startTime,
      endTime: s.endTime,
      status: s.status,
      createdAt: s.createdAt,
    }));

    return {
      status: 200,
      body: {
        data: formattedSchedules,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllSchedules:", error);
    return {
      status: 500,
      body: { success: false, error: "Failed to get all schedules" },
    };
  }
};

export const getScheduleByID: AppRouteQueryImplementation<
  typeof scheduleContract.getScheduleByID
> = async ({ req }) => {
try{
    const { scheduleID } = req.params; // matches pathParams in your contract

    if (!scheduleID) {
      return {
        status: 400,
        body: { success: false, error: "Schedule ID is required" },
      };
    }
  
    const schedule = await scheduleRepository.getByID(scheduleID);
  
    if (!schedule) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Schedule not found",
        },
      };
    }
  
    return {
      status: 200,
      body: {
        _id: schedule._id.toString(),
        tenantId: schedule.tenantId.toString(),
        title: schedule.title,
        staffId: schedule.staffId.toString(),
        clientId: schedule.clientId.toString(),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        status: schedule.status,
        createdAt: schedule.createdAt,
      },
    };
}
catch(error){
    console.error("Error in getScheduleByID:", error);
    return {
      status: 500,
      body: { success: false, error: "Failed to get schedule by ID" },
    };
  }
};

export const scheduleQueryHandler = {
  getAllSchedules,
  getScheduleByID,
};