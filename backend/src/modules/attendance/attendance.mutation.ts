import { AppRouteMutationImplementation } from "@ts-rest/express";
import { attendanceContract } from "../../contract/attendance/attendance.contract";
import attendanceRepository from "../../repository/attendance.repository";
import mongoose from "mongoose";
import userRepository from "../../repository/user.repository";
import businessRepository from "../../repository/business.repository";
import activityLogRepository from "../../repository/activity-log.repository";

export const createAttendance: AppRouteMutationImplementation<
  typeof attendanceContract.createAttendance
> = async ({ req }) => {
  try {
    const { userIds, business_id } = req.body;

    if (!userIds || !userIds.length) {
      return {
        status: 400,
        body: {
          success: false,
          error: "userIds are required",
        },
      };
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const results = [];

    for (const userId of userIds) {
      // 1. prevent duplicate today attendance
      const existing = await attendanceRepository.findOne({
        userIds: [new mongoose.Types.ObjectId(userId)],
        date: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      });

      if (existing) continue;

      // 2. create attendance
      const attendance = await attendanceRepository.createAttendance({
        userId: new mongoose.Types.ObjectId(userId),
        business_id: new mongoose.Types.ObjectId(business_id),
        status: "Present",
        checkIn: new Date(),
        checkOut: undefined,
        date: new Date(), // IMPORTANT FIX
      });

      results.push(attendance);
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Attendance created",
        data: results,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, error: (error as Error).message },
    };
  }
};

export const updateAttendance: AppRouteMutationImplementation<
  typeof attendanceContract.updateAttendance
> = async ({ req }) => {
  try {
    const { clientName, method, checkIn, checkOut, status } = req.body;
    const updated = await attendanceRepository.updateAttendance(
      req.params.attendanceID,
      {
        method,
        checkIn,
        checkOut,
        status,
      },
    );

    return {
      status: 200,
      body: { success: true, data: updated },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, error: (error as Error).message },
    };
  }
};

export const removeAttendance: AppRouteMutationImplementation<
  typeof attendanceContract.removeAttendance
> = async ({ req }) => {
  try {

    const date = new Date();
    const search = await attendanceRepository.getAttendanceByID(
      req.params.attendanceID,
      date,
    );

    if (!search) {
      return {
        status: 404,
        body: { success: false, error: "Attendance not found" },
      };
    }

    const deleted = await attendanceRepository.removeAttendance(
      req.params.attendanceID,
    );

    if (!deleted) {
      return {
        status: 404,
        body: { success: false, error: "Attendance was not deleted" },
      };
    }

    const businessUser = await businessRepository.getByID(
      search.business_id.toString(),
    );
    const user = await userRepository.getByID(search.business_id.toString());
    const account = businessUser || user;

    if (!account) {
      return {
        status: 404,
        body: { success: false, error: "User not found" },
      };
    }

    const isBusiness = "operatorPassword" in account;

    const userName = isBusiness ? account.operatorName : account.userName;

    const createLogs = await activityLogRepository.create({
      module: "Attendance",
      action: "DELETE",
      userId: new mongoose.Types.ObjectId(account._id),
      title: "Business Attendance",
      role: account.role,
      description: `Attendance removed by user: ${userName}`,
    });

    return {
      status: 200,
      body: { success: true, message: "Attendance removed" },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, error: (error as Error).message },
    };
  }
};

export const attendanceMutationHandler = {
  createAttendance,
  updateAttendance,
  removeAttendance,
};
