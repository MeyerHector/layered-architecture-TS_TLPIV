import { User } from "../models";

export class UserRepository {
  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id: string) {
    return await User.findByPk(id, { attributes: ["id", "name", "email"] });
  }
}
