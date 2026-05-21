import { AppRouteQueryImplementation } from "@ts-rest/express";
import { attendanceContract } from "../../contract/attendance/attendance.contract";
import attendanceRepository from "../../repository/attendance.repository";

export const getAllAttendance: AppRouteQueryImplementation<
  typeof attendanceContract.getAllAttendance
> = async ({ req }) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { data, total } = await attendanceRepository.getAllAttendance(skip, limit);
    const totalPages = Math.ceil(total / limit);

    const formattedAttendance = data.map((u) => ({
      _id: u._id.toString(),
      business_id: u.business_id.toString(),
      clientId: u.clientId.toString(),
      checkIn: u.checkIn,
      checkOut: u.checkOut,
      userType: u.userType as "STAFF" | "CLIENT",
      method: u.method as "QR" | "Manual",
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formattedAttendance,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const getAttendanceByID: AppRouteQueryImplementation<
  typeof attendanceContract.getAttendanceByID
> = async ({ req }) => {
  const { attendanceID } = req.params;
  if (!attendanceID) {
    return {
      status: 400,
      body: { success: false, error: "Attendance ID is required" },
    };
  }

  const data = await attendanceRepository.getAttendanceByID(
    req.params.attendanceID,
  );

  if (!data) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Not found",
      },
    };
  }

  return {
    status: 200,
    body: {
      _id: data._id.toString(),
      business_id: data.business_id.toString(),
      clientId: data.clientId.toString(),
      userType: data.userType === "CLIENT" ? "CLIENT" : "STAFF",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      method: data.method,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
  };
};

export const attendanceQueryHandler = {
  getAllAttendance,
  getAttendanceByID,
};
