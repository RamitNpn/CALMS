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
      console.log("🔧 REPOSITORY UPDATE - ID:", id);
      console.log("🔧 REPOSITORY UPDATE - DATA:", JSON.stringify(data, null, 2));

      // Handle customFields separately as it's a Map type
      const updateData: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (key === 'customFields') {
          // For Map types, use $set to properly replace the entire map
          // The custom fields object will completely replace existing map
          updateData.customFields = value;
        } else {
          updateData[key] = value;
        }
      }

      console.log("🔧 PROCESSED UPDATE DATA:", JSON.stringify(updateData, null, 2));

      const updated = await this.model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: false }
      );

      console.log("✅ REPOSITORY UPDATE - RESULT:", JSON.stringify(updated, null, 2));
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