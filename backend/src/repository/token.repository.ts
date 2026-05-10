import TokenModel, { IToken } from "../models/token.model";

class TokenRepository {
  private model;

  constructor() {
    this.model = TokenModel;
  }

  async create(data: Partial<IToken>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating token: ${error}`);
    }
  }

  async getAll(skip: number = 0, limit: number = 10) {
    try {
      const data = await this.model.find().sort({ number: 1 }).skip(skip).limit(limit);
      const total = await this.model.countDocuments();
      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching tokens: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching token: ${error}`);
    }
  }

  async update(id: string, data: Partial<IToken>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(`Error updating token: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting token: ${error}`);
    }
  }
}

export default new TokenRepository();