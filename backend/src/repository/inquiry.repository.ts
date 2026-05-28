import { DrivingInquiryModel, IDrivingInquiry } from "../models/inquiry.model";

class InquiryRepository {
  private model;

  constructor() {
    this.model = DrivingInquiryModel;
  }

  async create(data: Partial<IDrivingInquiry>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating inquiry: ${error}`);
    }
  }

  async getAll(skip = 0, limit = 10) {
    try {
      const data = await this.model
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments();

      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching inquiries: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching inquiry: ${error}`);
    }
  }

  async update(id: string, data: Partial<IDrivingInquiry>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(`Error updating inquiry: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting inquiry: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting inquiries: ${error}`);
    }
  }

  async aggregate(pipeline: any[]) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw new Error(`Error aggregating inquiries: ${error}`);
    }
  }

  async search(filter: Record<string, any> = {}) {
    try {
      return await this.model.find(filter).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error searching inquiries: ${error}`);
    }
  }
}

export default new InquiryRepository();
