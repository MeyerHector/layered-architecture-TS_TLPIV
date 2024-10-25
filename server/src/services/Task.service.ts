import { CreateTask } from "../interfaces";
import { TaskRepository } from '../repositories/Task.repository';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    public async createTask(taskData: CreateTask) {
        const { title, description, date, userId } = taskData;
        try {
            const task = await this.taskRepository.createTask(title, description, date, userId);
            return task;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getTasksByUser(userId: string) {
        return await this.taskRepository.getTasksByUser(userId);
    }

    public async getTaskById(taskId: string) {
        return await this.taskRepository.getTaskById(taskId);
    }
}
