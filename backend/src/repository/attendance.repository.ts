import AttendanceModel, { IAttendance } from "../models/attendance.model";

class AttendanceRepository {
  private model;

  constructor() {
    this.model = AttendanceModel;
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
      return await this.model.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching attendance: ${error}`);
    }
  }

  async getAttendanceByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching attendance: ${error}`);
    }
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
}

export default new AttendanceRepository();