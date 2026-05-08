import { AppRouteMutationImplementation } from "@ts-rest/express";
import { attendanceContract } from "../../contract/attendance/attendance.contract";
import attendanceRepository from "../../repository/attendance.repository";
import mongoose from "mongoose";
import userRepository from "../../repository/user.repository";

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
