import BillingModel, { IBilling } from "../models/billing.model";

class InvoiceRepository {
  private model;

  constructor() {
    this.model = BillingModel;
  }

  async create(data: Partial<IBilling >) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating billing: ${error}`);
    }
  }

  async getAll() {
    try {
      return await this.model.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching billings: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching billing: ${error}`);
    }
  }

  async update(id: string, data: Partial<IBilling>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(`Error updating billing: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting billing: ${error}`);
    }
  }
}

export default new InvoiceRepository();