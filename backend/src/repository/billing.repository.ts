import BillingModel, { IBilling } from "../models/billing.model";

class InvoiceRepository {
  private model;

  constructor() {
    this.model = BillingModel;
  }

  async create(data: Partial<IBilling>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating billing: ${error}`);
    }
  }

  async getAll(
    skip: number = 0,
    limit: number = 10,
    search?: string,
    dateFilter?: string,
  ) {
    try {
      const filter: any = {};

      if (search) {
        filter.$or = [
          { clientName: { $regex: search, $options: "i" } },
          { clientEmail: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ];
      }

      const now = new Date();

      if (dateFilter && dateFilter !== "all") {
        let startDate: Date;

        switch (dateFilter) {
          case "current_day":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            filter.createdAt = { $gte: startDate, $lte: now };
            break;

          case "current_week": {
            const firstDayOfWeek = new Date(now);
            const day = firstDayOfWeek.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            firstDayOfWeek.setDate(firstDayOfWeek.getDate() + diff);
            firstDayOfWeek.setHours(0, 0, 0, 0);

            filter.createdAt = { $gte: firstDayOfWeek, $lte: now };
            break;
          }

          case "current_month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            filter.createdAt = { $gte: startDate, $lte: now };
            break;

          case "current_year":
            startDate = new Date(now.getFullYear(), 0, 1);
            filter.createdAt = { $gte: startDate, $lte: now };
            break;
        }
      }

      const data = await this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

      const total = await this.model.countDocuments(filter);

      return { data, total };
    } catch (error) {
      throw new Error(
        `Error fetching billings: ${error}`
      );
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching billing: ${error}`);
    }
  }

  async update(
    id: string,
    data: Partial<IBilling>
  ) {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        data,
        { new: true }
      );
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

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting billings: ${error}`);
    }
  }

  async aggregate(pipeline: any[]) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw new Error(
        `Error aggregating billings: ${error}`
      );
    }
  }
}

export default new InvoiceRepository();