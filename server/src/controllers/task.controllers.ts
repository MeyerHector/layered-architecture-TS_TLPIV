import { Request, Response } from "express";
import { TaskService } from "../services/Task.service";
import { CreateTask } from '../interfaces/create-task.interface';

export class TaskController {
    public taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
 
        this.createTask = this.createTask.bind(this);
    }

    public async createTask(req: Request, res: Response): Promise<void> {
        try {
            const { title, date, description } = req.body as CreateTask;
            const task = await this.taskService.createTask({title, date, description, userId: req.user.id});
            res.status(201).json(task);
        } catch (error: any) {
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
            const task = await this.taskService.getTaskById(req.params.id);
            if (!task) {
                res.status(404).json({ message: "Task not found" });
            } else {
                res.json(task);
            }
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}