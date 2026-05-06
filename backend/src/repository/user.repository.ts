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

  async getAll() {
    try {
      return await this.model.find().sort({ createdAt: -1 });
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
        userEmail: email });
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
}

export default new UserRepository();