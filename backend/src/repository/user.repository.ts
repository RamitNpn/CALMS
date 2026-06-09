import UserModel, { IUser } from "../models/user.model";

class UserRepository {
  private model;

  constructor() {
    this.model = UserModel;
  }

  async create(data: Partial<IUser>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  async getAll({
    skip = 0,
    limit = 10,
    role,
    search,
    dateFilter,
  }: {
    skip?: number;
    limit?: number;
    role?: string;
    search?: string;
    dateFilter?: string;
  }) {
    try {
      const query: any = {};

      if (role && role !== "all") {
        query.role = role;
      }
      if (search) {
        query.$or = [
          { userName: { $regex: search, $options: "i" } },
          { userEmail: { $regex: search, $options: "i" } },
          { userPhone: { $regex: search, $options: "i" } },
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
            query.createdAt = { $gte: startDate, $lte: now };
            break;
          case "current_week": {
            const firstDayOfWeek = new Date(now);
            const day = firstDayOfWeek.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            firstDayOfWeek.setDate(firstDayOfWeek.getDate() + diff);
            firstDayOfWeek.setHours(0, 0, 0, 0);

            query.createdAt = { $gte: firstDayOfWeek, $lte: now };
            break;
          }
          case "current_month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            query.createdAt = { $gte: startDate, $lte: now };
            break;
          case "current_year":
            startDate = new Date(now.getFullYear(), 0, 1);
            query.createdAt = { $gte: startDate, $lte: now };
            break;
        }
      }

      console.log({
        role,
        search,
        query,
      });

      const data = await this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching users: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching user: ${error}`);
    }
  }

  async getByEmail(email: string) {
    try {
      return await this.model.findOne({
        userEmail: email,
      });
    } catch (error) {
      throw new Error(`Error fetching user: ${error}`);
    }
  }

  async update(id: string, data: Partial<IUser>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting users: ${error}`);
    }
  }
}

export default new UserRepository();
