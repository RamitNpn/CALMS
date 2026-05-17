import BusinessServiceConfigModel, {
  IBusinessServiceConfig,
} from "../models/business-service-config.model";

class BusinessServiceConfigRepository {
  private model;

  constructor() {
    this.model = BusinessServiceConfigModel;
  }

  async create(data: Partial<IBusinessServiceConfig>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating business service config: ${error}`);
    }
  }

  async getByBusinessID(business_id: string) {
    try {
      return await this.model.findOne({
        business_id,
      });
    } catch (error) {
      throw new Error(`Error fetching business service config: ${error}`);
    }
  }

  async update(business_id: string, data: Partial<IBusinessServiceConfig>) {
    try {
      return await this.model.findOneAndUpdate(
        {
          business_id,
        },
        data,
        {
          new: true,
        },
      );
    } catch (error) {
      throw new Error(`Error updating business service config: ${error}`);
    }
  }

  async remove(business_id: string) {
    try {
      return await this.model.findOneAndDelete({
        business_id,
      });
    } catch (error) {
      throw new Error(`Error deleting business service config: ${error}`);
    }
  }
}

export default new BusinessServiceConfigRepository();
