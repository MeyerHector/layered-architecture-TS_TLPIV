import sequelize from "sequelize";
import { Task, User } from "../models";

export class TaskRepository {
  public async createTask(
    title: string,
    description: string,
    date: Date,
    userId: string | undefined,
    t: sequelize.Transaction
  ) {
    return await Task.create(
      {
        title,
        description,
        date,
        userId,
      },
      { transaction: t }
    );
  }
  public async createSubTask(
    title: string,
    description: string,
    parentId: string,
    userId: string | undefined,
    t: sequelize.Transaction
  ) {
    return await Task.create(
      {
        title,
        description,
        userId,
        parentId,
      },
      { transaction: t }
    );
  }

  public async getTasksByUser(userId: string) {
    const tasks = await Task.findAll({
      where: { userId, parentId: null },
      include: [User],
    });

    const tasksWithSubTasks = await Promise.all(
      tasks.map(async (task) => {
        const subTasks = await Task.findAll({ where: { parentId: task.id } });
        task.setDataValue("subTasks", subTasks);
        return task;
      })
    );
    return tasksWithSubTasks;
  }

  public async getTaskById(taskId: string) {
    const task = await Task.findByPk(taskId, { include: [User] });
    if (task) {
      const subtasks = await Task.findAll({ where: { parentId: taskId } });
      task.setDataValue("subTasks", subtasks);
    }
    return task;
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

  public async markTaskAsCompletedOrNot(taskId: string) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    return await task.update({ completed: !task.completed });
  }

  public async getCompletedTasks(userId: string) {
    return await Task.findAll({
      where: { userId, completed: true },
      include: [User],
    });
  }

  public async getIncompleteTasks(userId: string) {
    return await Task.findAll({
      where: { userId, completed: false },
      include: [User],
    });
  }
}
