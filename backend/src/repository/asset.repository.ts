import AssetModel, { IAsset } from "../models/asset.model";

class AssetRepository {
  private model;

  constructor() {
    this.model = AssetModel;
  }

  async create(data: Partial<IAsset>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating asset: ${error}`);
    }
  }

  async getAll({
    business_id,
    skip = 0,
    limit = 10,
    search,
    dateFilter,
  }: {
    business_id?: string;
    skip?: number;
    limit?: number;
    search?: string;
    dateFilter?: string;
  }) {
    try {
      const query: any = {};

      if (business_id) {
        query.business_id = business_id;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { type: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
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
      throw new Error(`Error fetching assets: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching asset: ${error}`);
    }
  }

  async update(id: string, data: Partial<IAsset>) {
    try {
      const updated = await this.model.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: false,
        }
      );

      return updated;
    } catch (error) {
      throw new Error(`Error updating asset: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting asset: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting assets: ${error}`);
    }
  }

  async aggregate(pipeline: any[]) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw new Error(`Error aggregating assets: ${error}`);
    }
  }
}

export default new AssetRepository();