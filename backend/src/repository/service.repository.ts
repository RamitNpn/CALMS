import ServiceModel, { IService } from "../models/service.model";

class ServiceRepository {
  private model;

  constructor() {
    this.model = ServiceModel;
  }

  async create(data: Partial<IService>) {
    try {
      const result = await this.model.create(data);
      return result;
    } catch (error) {
      throw new Error(`Error creating service: ${error}`);
    }
  }

  async count() {
    try {
      const count = await this.model.countDocuments({});
      return count;
    } catch (error) {
      throw new Error(`Error counting services: ${error}`);
    }
  }

  async getAll() {
    try {
      const data = await this.model.find().sort({ createdAt: -1 });
      return data;
    } catch (error) {
      throw new Error(`Error fetching services: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching service: ${error}`);
    }
  }

  async getByServiceKey(service_key: string) {
    try {
      return await this.model.findOne({
        service_key,
      });
    } catch (error) {
      throw new Error(`Error fetching service by key: ${error}`);
    }
  }

  async update(id: string, data: Partial<IService>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Error updating service: ${error}`);
    }
  }

  async remove(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error removing service: ${error}`);
    }
  }
}

export default new ServiceRepository();
