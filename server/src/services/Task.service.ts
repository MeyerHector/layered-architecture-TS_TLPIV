import sequelize from "sequelize";
import { CreateTask } from "../interfaces";
import { TaskRepository } from "../repositories/Task.repository";
import { Sequelize } from "sequelize-typescript";

export class TaskService {
  private taskRepository: TaskRepository;
  private sequelize: Sequelize;
  constructor(sequelizeInstance: Sequelize) {
    this.taskRepository = new TaskRepository();
    this.sequelize = sequelizeInstance;
  }

  public async createTask(taskData: CreateTask) {
    const { title, description, date, userId, subTasks } = taskData;
    const t = await this.sequelize.transaction();
    try {
      const task = await this.taskRepository.createTask(
        title,
        description,
        date,
        userId,
        t
      );
      if (subTasks) {
        for (const subTask of subTasks) {
          await this.taskRepository.createSubTask(
            subTask.title,
            subTask.description,
            task.id,
            userId,
            t
          );
        }
      }
      await t.commit();
      return task;
    } catch (error: any) {
      await t.rollback();
      throw new Error(error.message);
    }
  }

  public async getTasksByUser(userId: string) {
    return await this.taskRepository.getTasksByUser(userId);
  }

  public async getTaskById(taskId: string) {
    const task = await this.taskRepository.getTaskById(taskId);
    console.log("task", task);
    return task;
  }

  public async updateTask(taskId: string, taskData: CreateTask) {
    const { title, description, date, userId, subTasks } = taskData;
    console.log("subTasks", subTasks);
    try {
      const task = await this.taskRepository.updateTask(
        taskId,
        title,
        description,
        date,
        userId,
        subTasks
      );
      return task;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async deleteTask(taskId: string) {
    try {
      const task = await this.taskRepository.deleteTask(taskId);
      return task;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async markTaskAsCompletedOrNot(taskId: string) {
    try {
      const task = await this.taskRepository.markTaskAsCompletedOrNot(taskId);
      return task;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async getCompletedTasks(userId: string) {
    return await this.taskRepository.getCompletedTasks(userId);
  }

  public async getIncompleteTasks(userId: string) {
    return await this.taskRepository.getIncompleteTasks(userId);
  }
}
