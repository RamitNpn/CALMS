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

  async getAttendanceByID(id: string) {
    try {
      return await this.model.findOne({ _id: id });
    } catch (error) {
      throw new Error(`Error fetching attendance: ${error}`);
    }
  }

  getAttendanceByUserId = async (
    userId: string,
    skip: number,
    limit: number,
  ) => {
    const query = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    const [data, total] = await Promise.all([
      AttendanceModel.find(query)
        .populate("userId", "fullName email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      AttendanceModel.countDocuments(query),
    ]);

    return {
      data,
      total,
    };
  };

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
