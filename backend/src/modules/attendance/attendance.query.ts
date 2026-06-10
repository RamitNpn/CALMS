import { AppRouteQueryImplementation } from "@ts-rest/express";
import { attendanceContract } from "../../contract/attendance/attendance.contract";
import attendanceRepository from "../../repository/attendance.repository";
import userRepository from "../../repository/user.repository";

export const getTodayAttendance: AppRouteQueryImplementation<
  typeof attendanceContract.getTodayAttendance
> = async ({ req }) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string);
  const skip = (page - 1) * limit;

  const search = (req.query.search as string) || undefined;
  const role = (req.query.role as string) || undefined;

  const { data: users, total } = await userRepository.getAll({
    skip,
    limit,
    role,
    search,
  });

  const attendanceRecords = await attendanceRepository.getAttendanceByDate(
    req.query.business_id,
    new Date(),
  );

  const attendanceMap = new Map(
    attendanceRecords.map((a) => [a.userId.toString(), a]),
  );

  const merged = users.map((user) => {
    const userId = user._id?.toString();

    const attendance = userId ? attendanceMap.get(userId) : undefined;

    return {
      _id: user._id.toString(),
      userName: user.userName,
      userEmail: user.userEmail,
      role: user.role,
      attendanceId: attendance ? attendance._id.toString() : "",
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
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || undefined;
    const dateFilter = (req.query.dateFilter as string) || undefined;

    const { data, total } =
      await attendanceRepository.getAllAttendanceWithFilter({
        skip,
        limit,
        search,
        dateFilter,
      });

    const userIds = [
      ...new Set(
        data
          .map((attendance) => attendance.userId?.toString())
          .filter(Boolean),
      ),
    ];

    const users = await userRepository.getUsersByIds(userIds);

    const userMap = new Map(
      users.map((user) => [user._id.toString(), user]),
    );

    const formattedAttendance = data.map((attendance) => {
      const user = userMap.get(attendance.userId?.toString());

      return {
        _id: attendance._id.toString(),
        business_id: attendance.business_id?.toString(),
        userId: attendance.userId?.toString(),

        userName: user?.userName ?? "-",
        userEmail: user?.userEmail ?? "-",
        userPhone: user?.userPhone ?? "-",
        userType: user?.role === "client" ? "client" : "staff",

        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        method: attendance.method as "QR" | "Manual",
        status: attendance.status as
          | "Present"
          | "Absent"
          | "Leave"
          | "Late",

        createdAt: attendance.createdAt,
        updatedAt: attendance.updatedAt,
      };
    });

    return {
      status: 200,
      body: {
        data: formattedAttendance,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
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

  const user = await userRepository.getByID(data.userId?.toString() || "");

  return {
    status: 200,
    body: {
      _id: data._id.toString(),
      business_id: data.business_id.toString(),
      userId: data.userId.toString(),
      userName: user?.userName ?? "-",
      userEmail: user?.userEmail ?? "-",
      userType: user?.role === "client" ? "client" : "staff",
      userPhone: user?.userPhone ?? "-",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: data.status as "Present" | "Absent" | "Leave" | "Late",
      method: data.method,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
  };
};

export const getAttendanceByUserId: AppRouteQueryImplementation<
  typeof attendanceContract.getAttendanceByUserId
> = async ({ req }) => {
  try {
    const { userId } = req.params;

    const page = (req.query.page as unknown as number) || 1;
    const limit = (req.query.limit as unknown as number) || 10;
    const skip = (page - 1) * limit;
    const dateFilter = (req.query.dateFilter as string) || undefined;

    const { data, total } = await attendanceRepository.getAttendanceByUserId({
      userId,
      skip,
      dateFilter,
    });

    const user = await userRepository.getByID(userId);

    return {
      status: 200,
      body: {
        data: data.map((attendance: any) => ({
          _id: attendance._id.toString(),
          userId: attendance.userId?._id?.toString(),
          userName: user?.userName ?? "-",
          userEmail: user?.userEmail ?? "-",
          role: attendance.userId?.role ?? "-",
          status: attendance.status,
          checkIn: attendance.checkIn,
          checkOut: attendance.checkOut,
          createdAt: attendance.createdAt,
        })),

        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
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

export const attendanceQueryHandler = {
  getTodayAttendance,
  getAllAttendance,
  getAttendanceByID,
  getAttendanceByUserId,
};
