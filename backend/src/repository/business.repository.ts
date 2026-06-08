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
          { operatorName: { $regex: search, $options: "i" } },
          { operatorEmail: { $regex: search, $options: "i" } },
          { package: { $regex: search, $options: "i" } },
          { branch: { $regex: search, $options: "i" } },
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
        operatorEmail: email,
      });
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
