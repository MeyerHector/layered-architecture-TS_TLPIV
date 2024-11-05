import { Request, Response } from "express";
import { TaskService } from "../services/Task.service";
import { CreateTask } from "../interfaces/create-task.interface";
import db from "../config/db";

export class TaskController {
  public taskService: TaskService;

  constructor() {
    this.taskService = new TaskService(db);

    this.createTask = this.createTask.bind(this);
  }

  public async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, date, description, importance, subTasks } = req.body as CreateTask;

      const task = await this.taskService.createTask({
        title,
        date,
        description,
        importance,
        userId: req.user.id,
        subTasks,
      });
      res.status(201).json(task);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  public async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getTasksByUser(req.user.id);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      console.log("params", req.params.id);
      const task = await this.taskService.getTaskById(req.params.id);
      console.log(task);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.json(task);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, date, description, importance, subTasks } = req.body as CreateTask;
      const task = await this.taskService.updateTask(req.params.id, {
        title,
        date,
        description,
        importance,
        userId: req.user.id,
        subTasks,
      });
      if (!task) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.json(task);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.taskService.deleteTask(req.params.id);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.json({ message: "Task deleted" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public async markTaskAsCompletedOrNot(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const task = await this.taskService.markTaskAsCompletedOrNot(
        req.params.id
      );
      if (!task) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.json({ message: "Task marked as done" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public async getCompletedTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getCompletedTasks(req.user.id);
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public async getIncompleteTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getIncompleteTasks(req.user.id);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
