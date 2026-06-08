import mongoose from "mongoose";
import AttendanceModel, { IAttendance } from "../models/attendance.model";

class AttendanceRepository {
  private model;

  constructor() {
    this.model = AttendanceModel;
  }

  async findOne(filter: Record<string, any>) {
    return await this.model.findOne(filter);
  }

  async createAttendance(data: Partial<IAttendance>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating attendance: ${error}`);
    }
  }

  async getAllAttendance() {
    try {
      const data = await this.model.find().sort({ createdAt: -1 });

      const total = await this.model.countDocuments();

      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching attendance: ${error}`);
    }
  }

  async getAllAttendanceWithFilter({
    skip,
    limit,
    search,
    dateFilter,
  }: {
    skip: number;
    limit: number;
    search?: string;
    dateFilter?: string;
  }) {
    try {
      const filter: any = {};

      if (search) {
        filter.$or = [
          { userName: { $regex: search, $options: "i" } },
          { userEmail: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      const now = new Date();

      if (dateFilter && dateFilter !== "all") {
        let startDate: Date;

        switch (dateFilter) {
          case "current_day":
            startDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            );
            filter.createdAt = { $gte: startDate, $lte: now };
            break;

          case "current_week": {
            const firstDayOfWeek = new Date(now);
            const day = firstDayOfWeek.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            firstDayOfWeek.setDate(firstDayOfWeek.getDate() + diff);
            firstDayOfWeek.setHours(0, 0, 0, 0);

            filter.createdAt = { $gte: firstDayOfWeek, $lte: now };
            break;
          }

          case "current_month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            filter.createdAt = { $gte: startDate, $lte: now };
            break;

          case "current_year":
            startDate = new Date(now.getFullYear(), 0, 1);
            filter.createdAt = { $gte: startDate, $lte: now };
            break;
        }
      }

      const [data, total] = await Promise.all([
        this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        this.model.countDocuments(filter),
      ]);

      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching attendance with filter: ${error}`);
    }
  }

  async getAttendanceByID(id: string) {
    try {
      return await this.model.findOne({ _id: id });
    } catch (error) {
      throw new Error(`Error fetching attendance: ${error}`);
    }
  }

  async getAttendanceByUserId({
    userId,
    skip,
    dateFilter,
  }: {
    userId: string;
    skip: number;
    dateFilter?: string;
  }) {
    const query: any = {};

    if (userId) {
      query.userId = userId;
    }

    const now = new Date();

    if (dateFilter && dateFilter !== "all") {
      let startDate: Date;

      switch (dateFilter) {
        case "current_day":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          query.createdAt = { $gte: startDate, $lte: now };
          break;

        case "current_week": {
          const firstDayOfWeek = new Date(now);
          const day = firstDayOfWeek.getDay();
          const diff = day === 0 ? -6 : 1 - day;
          firstDayOfWeek.setDate(firstDayOfWeek.getDate() + diff);
          firstDayOfWeek.setHours(0, 0, 0, 0);

          query.createdAt = { $gte: firstDayOfWeek, $lte: now };
          break;
        }

        case "current_month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          query.createdAt = { $gte: startDate, $lte: now };
          break;

        case "current_year":
          startDate = new Date(now.getFullYear(), 0, 1);
          query.createdAt = { $gte: startDate, $lte: now };
          break;
      }
    }

    const [data, total] = await Promise.all([
      AttendanceModel.find(query)
        .populate("userId", "fullName email role")
        .sort({ createdAt: -1 })
        .skip(skip),

      AttendanceModel.countDocuments(query),
    ]);

    return {
      data,
      total,
    };
  }

  async updateAttendance(id: string, data: Partial<IAttendance>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(`Error updating attendance: ${error}`);
    }
  }

  async removeAttendance(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error removing attendance: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting attendance: ${error}`);
    }
  }

  async aggregate(pipeline: any[]) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw new Error(`Error aggregating attendance: ${error}`);
    }
  }

  async getAttendanceByDate(business_id: string, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.model
      .find({
        business_id,
        checkIn: {
          $gte: start,
          $lte: end,
        },
      })
      .lean();
  }
}

export default new AttendanceRepository();
