import { AppRouteMutationImplementation } from "@ts-rest/express";
import { scheduleContract } from "../../contract/schedule/schedule.contract";
import scheduleRepository from "../../repository/schedule.repository";
import mongoose from "mongoose";

export const createSchedule: AppRouteMutationImplementation<
  typeof scheduleContract.createSchedule
> = async ({ req }) => {
  try {
    const {
      endTime,
      startTime,
      tenantId,
      clientId,
      staffId,
      status,
      title
    } = req.body;

    const schedule = await scheduleRepository.create({
      endTime,
      startTime,
      tenantId: new mongoose.Types.ObjectId(req.body.tenantId),
      clientId: new mongoose.Types.ObjectId(req.body.clientId),
      staffId: new mongoose.Types.ObjectId(req.body.staffId),
      status,
      title
    });

    return {
      status: 201,
      body: { success: true, message: "Schedule created", data: schedule },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, error: (error as Error).message },
    };
  }
};

export const updateSchedule: AppRouteMutationImplementation<
  typeof scheduleContract.updateSchedule
> = async ({ req }) => {
  try {
    const { scheduleID } = req.params;
   const {
      endTime,
      startTime,
      clientId,
      staffId,
      status,
      title
    } = req.body;

    const updated = await scheduleRepository.update(scheduleID, {
      endTime,
      startTime,
      clientId: new mongoose.Types.ObjectId(req.body.clientId),
      staffId: new mongoose.Types.ObjectId(req.body.staffId),
      status,
      title
    });

    if (!updated) {
      return {
        status: 404,
        body: { success: false, error: "Schedule not found" },
      };
    }

    return {
      status: 200,
      body: { success: true, message: "Schedule updated", data: updated },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, error: (error as Error).message },
    };
  }
};

export const removeSchedule: AppRouteMutationImplementation<
  typeof scheduleContract.removeSchedule
> = async ({ req }) => {
  try {
    await scheduleRepository.delete(req.body._id);

    return {
      status: 200,
      body: { success: true, message: "Schedule deleted" },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, error: (error as Error).message },
    };
  }
};

export const scheduleMutationHandler = {
  createSchedule,
  updateSchedule,
  removeSchedule,
};