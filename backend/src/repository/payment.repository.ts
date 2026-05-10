import PaymentModel, { IPayment } from "../models/payment.model";

class PaymentRepository {
  private model;

  constructor() {
    this.model = PaymentModel;
  }

  async create(data: Partial<IPayment>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating payment: ${error}`);
    }
  }

  async getAll(skip: number = 0, limit: number = 10) {
    try {
      const data = await this.model
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await this.model.countDocuments();
      
      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching payments: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching payment: ${error}`);
    }
  }

  async getByBusinessID(businessId: string) {
    try {
      return await this.model
        .find({ business_id: businessId })
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching business payments: ${error}`);
    }
  }

  async getActiveSubscription(businessId: string) {
    try {
      return await this.model.findOne({
        business_id: businessId,
        isActive: true,
        endAt: { $gte: new Date() },
      });
    } catch (error) {
      throw new Error(`Error fetching active subscription: ${error}`);
    }
  }

  async getLatestPaymentByBusiness(businessId: string) {
    return await this.model
      .findOne({ business_id: businessId })
      .sort({ endAt: -1 });
  }

  async update(id: string, data: Partial<IPayment>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(`Error updating payment: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting payment: ${error}`);
    }
  }
}

export default new PaymentRepository();
