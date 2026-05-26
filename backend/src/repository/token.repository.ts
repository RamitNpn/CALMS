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
