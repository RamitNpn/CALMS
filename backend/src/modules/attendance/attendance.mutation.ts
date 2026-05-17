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
    const {
      business_id,
      clientName,
      clientEmail,
      userType,
      checkIn,
      checkOut,
    } = req.body;

    if (!clientEmail) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Client email is required",
        },
      };
    }

    const clientData = await userRepository.getByEmail(
      clientEmail.toLowerCase(),
    );

    if (!clientData) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Client with that email does not exist",
        },
      };
    }

    const attendance = await attendanceRepository.createAttendance({
      business_id: new mongoose.Types.ObjectId(business_id),
      clientId: new mongoose.Types.ObjectId(clientData._id),
      clientName,
      clientEmail,
      userType,
      checkIn,
      checkOut,
    });

    const businessUser = await businessRepository.getByID(business_id);
    const user = await userRepository.getByID(business_id);
    const account = businessUser || user;

    if (!account) {
      return {
        status: 404,
        body: { success: false, error: "User not found" },
      };
    }

    const isBusiness = "operatorPassword" in account;

    const userName = isBusiness ? account.operatorName : account.userName;

    if (attendance) {
      const createLogs = await activityLogRepository.create({
        module: "Attendance",
        action: "CREATE",
        userId: new mongoose.Types.ObjectId(business_id),
        userName: userName,
        description: `Attendance created for client: ${clientName}`,
      });
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Attendance created",
        data: attendance,
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
    const { clientName, method, checkIn, checkOut } = req.body;
    const updated = await attendanceRepository.updateAttendance(
      req.params.attendanceID,
      {
        clientName,
        method,
        checkIn,
        checkOut,
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
    const search = await attendanceRepository.getAttendanceByID(
      req.params.attendanceID,
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
