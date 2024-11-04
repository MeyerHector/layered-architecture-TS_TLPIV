import { Task, User } from "../models";

export class TaskRepository {
  public async createTask(
    title: string,
    description: string,
    date: Date,
    importance: string,
    userId: string | undefined
  ) {
    return await Task.create({
      title,
      description,
      date,
      importance,
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
    importance: string,
    userId: string | undefined
  ) {
    return await Task.update(
      { title, description, date, importance, userId },
      { where: { id: taskId } }
    );
  }

  public async deleteTask(taskId: string) {
    return await Task.destroy({ where: { id: taskId } });
  }
}
