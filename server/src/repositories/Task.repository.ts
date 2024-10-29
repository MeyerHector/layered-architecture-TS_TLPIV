import { Task, User } from "../models";

export class TaskRepository {
  public async createTask(
    title: string,
    description: string,
    date: Date,
    userId: string | undefined
  ) {
    return await Task.create({
      title,
      description,
      date,
      userId,
    });
  }

  public async getTasksByUser(userId: string) {
    return await Task.findAll({ where: { userId }, include: [User] });
  }

  public async getTaskById(taskId: string) {
    return await Task.findByPk(taskId, { include: [User] });
  }

  public async updateTask(
    taskId: string,
    title: string,
    description: string,
    date: Date,
    userId: string | undefined
  ) {
    return await Task.update(
      { title, description, date, userId },
      { where: { id: taskId } }
    );
  }

  public async deleteTask(taskId: string) {
    return await Task.destroy({ where: { id: taskId } });
  }
}
