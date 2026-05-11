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

  async getAll(business_id?: string, skip: number = 0, limit: number = 10) {
    try {
      const query = business_id ? { business_id } : {};
      const data = await this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
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
      console.log("🔧 REPOSITORY UPDATE - ID:", id, "DATA:", data);

      // Use $set operator for proper Mongoose updates, especially with Map types
      const updated = await this.model.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      console.log("✅ REPOSITORY UPDATE - RESULT:", updated);
      return updated;
    } catch (error) {
      console.error("❌ REPOSITORY UPDATE ERROR:", error);
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