import { AppRouteQueryImplementation } from "@ts-rest/express";
import { attendanceContract } from "../../contract/attendance/attendance.contract";
import attendanceRepository from "../../repository/attendance.repository";
import userRepository from "../../repository/user.repository";

export const getTodayAttendance: AppRouteQueryImplementation<
  typeof attendanceContract.getTodayAttendance
> = async ({ req }) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 1000;
  const skip = (page - 1) * limit;

  const { data: users, total } = await userRepository.getAll(skip, limit);

  const attendanceRecords = await attendanceRepository.getAttendanceByDate(
    req.query.business_id,
    new Date(),
  );

  // 3. Map attendance by userId
  const attendanceMap = new Map(
    attendanceRecords.map((a) => [
      String(a.userId), // safer than toString()
      a,
    ]),
  );

  // 4. Merge (THIS IS THE KEY IDEA)
  const merged = users.map((user) => {
    const attendance = attendanceMap.get(user._id.toString());

    return {
      _id: user._id.toString(),
      userName: user.userName,
      userEmail: user.userEmail,
      role: user.role,
      attendanceId: attendance?._id?.toString(),
      userType: user.role === "client" ? "client" : "staff",
      status: attendance?.status,
      checkIn: attendance?.checkIn,
      checkOut: attendance?.checkOut,
    };
  });

  return {
    status: 200,
    body: {
      success: true,
      data: merged,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
};

export const getAllAttendance: AppRouteQueryImplementation<
  typeof attendanceContract.getAllAttendance
> = async ({ req }) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const date = new Date();

    const { data, total } = await attendanceRepository.getAllAttendance(
      skip,
      limit,
      date,
    );
    const totalPages = Math.ceil(total / limit);

    const formattedAttendance = data.map((u) => ({
      _id: u._id.toString(),
      business_id: u.business_id.toString(),
      userId: u.userId.toString(),
      checkIn: u.checkIn,
      checkOut: u.checkOut,
      method: u.method as "QR" | "Manual",
      status: u.status as "Present" | "Absent" | "Leave" | "Late",
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

  const date = new Date();

  const data = await attendanceRepository.getAttendanceByID(
    req.params.attendanceID,
    date,
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
      userId: data.userId.toString(),
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: data.status as "Present" | "Absent" | "Leave" | "Late",
      method: data.method,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
  };
};

export const attendanceQueryHandler = {
  getTodayAttendance,
  getAllAttendance,
  getAttendanceByID,
};
