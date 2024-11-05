import { Task, User } from "../models";

export class UserRepository {
  async getAllUsers() {
    return await User.findAll({
      attributes: ["id", "name", "email"],
      include: [
        {
          model: Task,
        },
      ],
    });
  }

  async getUserById(id: string) {
    return await User.findByPk(id, { attributes: ["id", "name", "email"] });
  }
}
