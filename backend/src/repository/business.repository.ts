import BusinessModel, { IBusiness } from "../models/business.model";

class BusinessRepository {
  private model;

  constructor() {
    this.model = BusinessModel;
  }

  async create(data: Partial<IBusiness>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating business: ${error}`);
    }
  }

  async getAll(skip: number = 0, limit: number = 10) {
    try {
      const data = await this.model.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
      const total = await this.model.countDocuments();
      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching businesses: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching business: ${error}`);
    }
  }

  async getByEmail(email: string) {
    try {
      return await this.model.findOne({ 
        operatorEmail: email });
    } catch (error) {
      throw new Error(`Error fetching business: ${error}`);
    }
  }

  async update(id: string, data: Partial<IBusiness>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(`Error updating business: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting business: ${error}`);
    }
  }
}

export default new BusinessRepository();
