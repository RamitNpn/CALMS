import AssetTypeModel, { IAssetType } from "../models/assettype.model";

class assetTypeRepository {
  private model;

  constructor() {
    this.model = AssetTypeModel;
  }

  async create(data: Partial<IAssetType>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating asset type: ${error}`);
    }
  }

  async getAll(
    business_id?: string,
    skip: number = 0,
    limit: number = 10
  ) {
    try {
      const query = business_id ? { business_id } : {};

      const data = await this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching asset types: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching asset type: ${error}`);
    }
  }

  async update(id: string, data: Partial<IAssetType>) {
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
      throw new Error(`Error updating asset type: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting asset type: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting asset types: ${error}`);
    }
  }
}

export default new assetTypeRepository();