import { IToken, TokenModel } from "../models/token.model";

class tokenRepository {
  private model;

  constructor() {
    this.model = TokenModel;
  }

  async create(data: Partial<IToken>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating driving institute token: ${error}`);
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
      throw new Error(`Error fetching driving institute tokens: ${error}`);
    }
  }

  async getAllWithFilter({
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
      const filter: any = {};

      if (search) {
        filter.$or = [
          { tokenNumber: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
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

      const [data, total] = await Promise.all([
        this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        this.model.countDocuments(filter),
      ]);

      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching driving institute tokens: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching driving institute token: ${error}`);
    }
  }

  async getByTokenNumber(tokenNumber: string) {
    try {
      return await this.model.findOne({
        tokenNumber,
      });
    } catch (error) {
      throw new Error(`Error fetching token by token number: ${error}`);
    }
  }

  async update(id: string, data: Partial<IToken>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Error updating driving institute token: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting driving institute token: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting driving institute tokens: ${error}`);
    }
  }

  async aggregate(pipeline: any[]) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw new Error(`Error aggregating driving institute tokens: ${error}`);
    }
  }

  async search(filter: Record<string, any> = {}) {
    try {
      return await this.model.find(filter).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error searching driving institute tokens: ${error}`);
    }
  }

  async getLatestDailyToken(date: string) {
    try {
      return await this.model
        .find({
          tokenNumber: {
            $regex: `^DRV-${date}-TKN-`,
          },
        })
        .sort({ createdAt: -1 })
        .limit(1)
        .lean();
    } catch (error) {
      throw new Error(`Error fetching latest daily token: ${error}`);
    }
  }
}

export default new tokenRepository();
