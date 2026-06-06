import { DrivingInquiryModel, IDrivingInquiry } from "../models/inquiry.model";

class InquiryRepository {
  private model;

  constructor() {
    this.model = DrivingInquiryModel;
  }

  async create(data: Partial<IDrivingInquiry>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating inquiry: ${error}`);
    }
  }

async getAll({
  skip,
  limit,
  search,
  dateFilter,
}: {
  skip: number;
  limit: number;
  search?: string;
  dateFilter?: string;
}) {
  const filter: any = {};

  if (search) {
    filter.$or = [
      {
        fullName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
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

        filter.createdAt = {
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

        filter.createdAt = {
          $gte: firstDayOfWeek,
          $lte: now,
        };
        break;
      }

      case "current_month":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
        );

        filter.createdAt = {
          $gte: startDate,
          $lte: now,
        };
        break;

      case "current_year":
        startDate = new Date(
          now.getFullYear(),
          0,
          1,
        );

        filter.createdAt = {
          $gte: startDate,
          $lte: now,
        };
        break;
    }
  }

  const total = await DrivingInquiryModel.countDocuments(filter);

  const data = await DrivingInquiryModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    data,
    total,
  };
}

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching inquiry: ${error}`);
    }
  }

  async update(id: string, data: Partial<IDrivingInquiry>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(`Error updating inquiry: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting inquiry: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting inquiries: ${error}`);
    }
  }

  async aggregate(pipeline: any[]) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw new Error(`Error aggregating inquiries: ${error}`);
    }
  }

  async search(filter: Record<string, any> = {}) {
    try {
      return await this.model.find(filter).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error searching inquiries: ${error}`);
    }
  }
}

export default new InquiryRepository();
