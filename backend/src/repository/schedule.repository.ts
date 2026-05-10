import ScheduleModel, { ISchedule } from "../models/schedule.model";

class ScheduleRepository {
  private model;

  constructor() {
    this.model = ScheduleModel;
  }

  async create(data: Partial<ISchedule>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating schedule: ${error}`);
    }
  }

  async getAll(skip: number = 0, limit: number = 10) {
    try {
      const data = await this.model.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
      const total = await this.model.countDocuments();
      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching schedules: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching schedule: ${error}`);
    }
  }

  async update(id: string, data: Partial<ISchedule>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(`Error updating schedule: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting schedule: ${error}`);
    }
  }
}

export default new ScheduleRepository();