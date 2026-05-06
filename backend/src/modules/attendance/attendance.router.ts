import { initServer } from "@ts-rest/express";
import { attendanceContract } from "../../contract/attendance/attendance.contract";

import { attendanceMutationHandler } from "./attendance.mutation";
import { attendanceQueryHandler } from "./attendance.query";

const s = initServer();

export const attendanceRouter = s.router(attendanceContract, {
  getAllAttendance: attendanceQueryHandler.getAllAttendance,
  getAttendanceByID: attendanceQueryHandler.getAttendanceByID,

  createAttendance: attendanceMutationHandler.createAttendance,
  updateAttendance: attendanceMutationHandler.updateAttendance,
  removeAttendance: attendanceMutationHandler.removeAttendance,
});