import FinanceModel, { IFinance } from "../models/finance.model";

class FinanceRepository {
  private model;

  constructor() {
    this.model = FinanceModel;
  }

  async create(data: Partial<IFinance>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating financial record: ${error}`);
    }
  }

  async getAll(business_id?: string, skip: number = 0, limit: number = 10) {
    try {
      const query = business_id ? { business_id } : {};

      const data = await this.model
        .find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return {
        data,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching financial records: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching financial record: ${error}`);
    }
  }

  async update(id: string, data: Partial<IFinance>) {
    try {
      const updated = await this.model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: false,
      });

      return updated;
    } catch (error) {
      throw new Error(`Error updating financial record: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting financial record: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting financial records: ${error}`);
    }
  }

  async aggregate(pipeline: any[]) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw new Error(`Error aggregating financial records: ${error}`);
    }
  }
}

export default new FinanceRepository();
