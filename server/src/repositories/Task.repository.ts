import sequelize from "sequelize";
import { Task, User } from "../models";
import { SubTask } from "../interfaces/create-task.interface";

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
      order: [["date", "ASC"]],
    });

    return await Promise.all(
      tasks.map(async (task) => {
        const subTasks = await Task.findAll({
          where: { parentId: task.id },
          order: [["createdAt", "ASC"]],
        });
        task.setDataValue("subTasks", subTasks);
        return task;
      })
    );
  }

  public async getTaskById(taskId: string) {
    const task = await Task.findByPk(taskId, { include: [User] });
    if (task) {
      const subtasks = await Task.findAll({
        where: { parentId: taskId },
        order: [["createdAt", "ASC"]],
      });
      task.setDataValue("subTasks", subtasks);
    }
    return task;
  }

  public async updateTask(
    taskId: string,
    title: string,
    description: string,
    date: Date,
    userId: string | undefined,
    subTasksData: [SubTask] | undefined
  ) {
    try {
      const task = await Task.findByPk(taskId);
      if (task) {
        const updatedTask = await Task.update(
          { title, description, date, userId },
          { where: { id: taskId } }
        );
        if (subTasksData) {
          const existingSubTasks = await Task.findAll({
            where: { parentId: taskId },
          });
          const existingSubTaskIds = existingSubTasks.map(
            (subTask) => subTask.id
          );
          const newSubTaskIds = subTasksData
            .map((subTask) => subTask.id)
            .filter((id): id is string => id !== undefined);

          // Identify sub-tasks to delete
          const subTasksToDelete = existingSubTaskIds.filter(
            (id) => !newSubTaskIds.includes(id)
          );

          // Identify sub-tasks to update
          const subTasksToUpdate = subTasksData.filter(
            (subTask) =>
              subTask.id !== undefined &&
              existingSubTaskIds.includes(subTask.id)
          );

          const subTasksToAdd = subTasksData.filter(
            (subTask) =>
              subTask.id === undefined ||
              !existingSubTaskIds.includes(subTask.id)
          );

          await Promise.all(
            subTasksToDelete.map(async (subTaskId) => {
              await Task.destroy({ where: { id: subTaskId } });
            })
          );

          await Promise.all(
            subTasksToUpdate.map(async (subTask) => {
              await Task.update(
                {
                  title: subTask.title,
                  description: subTask.description,
                  userId: subTask.userId,
                },
                { where: { id: subTask.id } }
              );
            })
          );

          await Promise.all(
            subTasksToAdd.map(async (subTask) => {
              await Task.create({
                title: subTask.title,
                description: subTask.description,
                userId: task.userId,
                parentId: taskId,
              });
            })
          );
        }

        return updatedTask;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  public async deleteTask(taskId: string) {
    return await Task.destroy({ where: { id: taskId } });
  }

  public async markTaskAsCompletedOrNot(taskId: string) {
    const task = await Task.findByPk(taskId);
    const subTasks = await Task.findAll({ where: { parentId: taskId } });
    if (!task) {
      throw new Error("Task not found");
    }
    if (subTasks.length > 0) {
      if (!task.completed) {
        Promise.all(
          subTasks.map(async (subTask) => {
            await subTask.update({ completed: true });
            console.log("se marco como completada");
          })
        );
      }
    }
    return await task.update({ completed: !task.completed });
  }

  public async getCompletedTasks(userId: string) {
    const tasks = await Task.findAll({
      where: { userId, completed: true, parentId: null },
      include: [User],
      order: [["date", "ASC"]],
    });
    return await Promise.all(
      tasks.map(async (task) => {
        const subTasks = await Task.findAll({
          where: { parentId: task.id },
          order: [["createdAt", "ASC"]],
        });
        task.setDataValue("subTasks", subTasks);
        return task;
      })
    );
  }

  public async getIncompleteTasks(userId: string) {
    const tasks = await Task.findAll({
      where: { userId, completed: false, parentId: null },
      include: [User],
      order: [["date", "ASC"]],
    });
    return await Promise.all(
      tasks.map(async (task) => {
        const subTasks = await Task.findAll({ where: { parentId: task.id } });
        task.setDataValue("subTasks", subTasks);
        return task;
      })
    );
  }
}
