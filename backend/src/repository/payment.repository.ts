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

  async getAll({
    skip = 0,
    limit = 10,
    search,
    dateFilter,
  }: {
    skip?: number;
    limit?: number;
    search?: string;
    dateFilter?: string;
  }) {
    try {
      const query: any = {};

      if (search) {
        query.$or = [
          { businessName: { $regex: search, $options: "i" } },
          { businessEmail: { $regex: search, $options: "i" } },
          { package: { $regex: search, $options: "i" } },
          { paymentStatus: { $regex: search, $options: "i" } },
        ];
      }

      const now = new Date();

      if (dateFilter && dateFilter !== "all") {
        let startDate: Date;

        switch (dateFilter) {
          case "current_day":
            startDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            );

            query.createdAt = {
              $gte: startDate,
              $lte: now,
            };
            break;

          case "current_week": {
            const firstDayOfWeek = new Date(now);
            const day = firstDayOfWeek.getDay();
            const diff = day === 0 ? -6 : 1 - day;

            firstDayOfWeek.setDate(firstDayOfWeek.getDate() + diff);
            firstDayOfWeek.setHours(0, 0, 0, 0);

            query.createdAt = {
              $gte: firstDayOfWeek,
              $lte: now,
            };
            break;
          }

          case "current_month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);

            query.createdAt = {
              $gte: startDate,
              $lte: now,
            };
            break;

          case "current_year":
            startDate = new Date(now.getFullYear(), 0, 1);

            query.createdAt = {
              $gte: startDate,
              $lte: now,
            };
            break;
        }
      }
      const data = await this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

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
