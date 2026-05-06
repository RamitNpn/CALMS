import { initServer } from "@ts-rest/express";
import { scheduleContract } from "../../contract/schedule/schedule.contract";

import { scheduleMutationHandler } from "./schedule.mutation";
import { scheduleQueryHandler } from "./schedule.query";

const s = initServer();

export const scheduleRouter = s.router(scheduleContract, {
  getAllSchedules: scheduleQueryHandler.getAllSchedules,
  getScheduleByID: scheduleQueryHandler.getScheduleByID,

  createSchedule: scheduleMutationHandler.createSchedule,
  updateSchedule: scheduleMutationHandler.updateSchedule,
  removeSchedule: scheduleMutationHandler.removeSchedule,
});