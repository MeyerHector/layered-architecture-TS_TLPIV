import { CreateTask } from "../interfaces";
import { Task } from "../models";
import { User } from "../models";
 
export class TaskService {

    public async createTask(taskData: CreateTask) {
        const {title, description, date} = taskData;
        try {
            const task = await Task.create({
                title,
                description,
                date,
                userId: taskData.userId
            });

            return task;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getTasksByUser(userId: string) {
        return await Task.findAll({where: {userId}, include: [User]});
    }

    public async getTaskById(taskId: string) {
        return await Task.findByPk(taskId, {include: [User]});
    }
}