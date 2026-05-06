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

  async getAll(business_id?: string) {
    try {
      const query = business_id ? { business_id } : {};
      return await this.model.find(query).sort({ createdAt: -1 });
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
      return await this.model.findByIdAndUpdate(id, data, { new: true });
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
}

export default new AssetRepository();