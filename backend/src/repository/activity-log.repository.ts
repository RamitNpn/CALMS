import ActivityLogModel, { IActivityLog } from "../models/activity-log.model";

class ActivityLogRepository {
  private model;

  constructor() {
    this.model = ActivityLogModel;
  }

  async create(data: Partial<IActivityLog>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating activity log: ${error}`);
    }
  }

  async getLogs(
    skip: number = 0,
    limit: number = 10,
    filters?: {
      module?: string;
      action?: string;
      userId?: string;
      recordId?: string;
    }
  ) {
    try {
      const query: any = {};

      if (filters?.module) query.module = filters.module;
      if (filters?.action) query.action = filters.action;
      if (filters?.userId) query.userId = filters.userId;
      if (filters?.recordId) query.recordId = filters.recordId;

      const data = await this.model
        .find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching activity logs: ${error}`);
    }
  }

  async removeLogs(log_id: string, business_id?: string) {
    try {
      const result = await this.model.findOneAndDelete({
        _id: log_id,
        business_id,
      });

      return result;
    } catch (error) {
      throw new Error(`Error removing activity logs: ${error}`);
    }
  }

  async getStats(module: string) {
    try {
      const stats = await this.model.aggregate([
        { $match: { module } },
        {
          $group: {
            _id: "$action",
            count: { $sum: 1 },
          },
        },
      ]);

      return stats;
    } catch (error) {
      throw new Error(`Error getting activity log stats: ${error}`);
    }
  }
}

export default new ActivityLogRepository();