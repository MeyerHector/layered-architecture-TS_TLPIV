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
    this.router.get("/tasks", validateToken, (req, res) =>
      this.taskController.getTasks(req, res)
    );
    this.router.post("/tasks", validateToken, (req, res) =>
      this.taskController.createTask(req, res)
    );
    this.router.get("/tasks/:id", validateToken, (req, res) =>
      this.taskController.getTaskById(req, res)
    );
    this.router.put("/tasks/:id", validateToken, (req, res) =>
      this.taskController.updateTask(req, res)
    );
    this.router.delete("/tasks/:id", validateToken, (req, res) =>
      this.taskController.deleteTask(req, res)
    );
    this.router.patch("/tasks/:id", validateToken, (req, res) => {
      this.taskController.markTaskAsCompletedOrNot(req, res);
    });

    this.router.get("/all-tasks-completed", validateToken, (req, res) => {
      this.taskController.getCompletedTasks(req, res);
    });

    this.router.get("/all-tasks-not-completed", validateToken, (req, res) => {
      this.taskController.getIncompleteTasks(req, res);
    });
  }
}

export default new TaskRoutes().router;
