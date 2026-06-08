import RoleModel, { IRole } from "../models/role.model";

class RoleRepository {
  async create(data: Partial<IRole>) {
    return await RoleModel.create(data);
  }

  async getAll() {
    return await RoleModel.find().sort({ role_name: 1 });
  }

  async getById(id: string) {
    return await RoleModel.findById(id);
  }

  async update(id: string, data: Partial<IRole>) {
    return await RoleModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await RoleModel.findByIdAndDelete(id);
  }
}

export default new RoleRepository();
