import ServiceModel, {
  IService,
} from "../models/service.model";

class ServiceRepository {
  private model;

  constructor() {
    this.model = ServiceModel;
  }

  async create(data: Partial<IService>) {
    try {
      console.log("🔍 Repository CREATE - Input data:", JSON.stringify(data));
      const result = await this.model.create(data);
      console.log("🔍 Repository CREATE - Result:", JSON.stringify(result));
      return result;
    } catch (error) {
      console.error("🔍 Repository CREATE - Error:", error);
      throw new Error(
        `Error creating service: ${error}`
      );
    }
  }

  async count() {
    try {
      console.log("🔍 Repository COUNT - Counting documents...");
      const count = await this.model.countDocuments({});
      console.log("🔍 Repository COUNT - Result:", count);
      return count;
    } catch (error) {
      console.error("🔍 Repository COUNT - Error:", error);
      throw new Error(
        `Error counting services: ${error}`
      );
    }
  }

  async getAll() {
    try {
      console.log("🔍 Repository GETALL - Fetching all services...");
      const data = await this.model
        .find()
        .sort({ createdAt: -1 });
      console.log("🔍 Repository GETALL - Found", data.length, "services");
      console.log("🔍 Repository GETALL - Data:", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("🔍 Repository GETALL - Error:", error);
      throw new Error(
        `Error fetching services: ${error}`
      );
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(
        `Error fetching service: ${error}`
      );
    }
  }

  async getByServiceKey(service_key: string) {
    try {
      return await this.model.findOne({
        service_key,
      });
    } catch (error) {
      throw new Error(
        `Error fetching service by key: ${error}`
      );
    }
  }

  async update(
    id: string,
    data: Partial<IService>
  ) {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
        }
      );
    } catch (error) {
      throw new Error(
        `Error updating service: ${error}`
      );
    }
  }

  async remove(id: string) {
    try {
      return await this.model.findByIdAndDelete(
        id
      );
    } catch (error) {
      throw new Error(
        `Error removing service: ${error}`
      );
    }
  }
}

export default new ServiceRepository();