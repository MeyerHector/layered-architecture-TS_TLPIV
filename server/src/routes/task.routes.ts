import { Router } from "express";
import { TaskController } from "../controllers/task.controllers";
import { validateToken } from "../auth/jwt/validate-token"; 
 
class TaskRoutes {
    public router: Router;
    public taskController: TaskController;

    constructor() {
        this.taskController = new TaskController();
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.get("/tasks", validateToken, (req, res) => this.taskController.getTasks(req, res));
        this.router.post("/tasks", validateToken, (req, res) => this.taskController.createTask(req, res));
        this.router.get("/tasks/:id", validateToken, (req, res) => this.taskController.getTaskById(req, res));
    }
}

export default new TaskRoutes().router;
