import { Router } from "express";
import { validateToken } from "../auth/jwt/validate-token";
import { UserController } from "../controllers/user.controllers";
 
class UserRoutes {
    public router: Router;
    public userController: UserController;

    constructor() {
        this.userController = new UserController();
        
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.get("/users", this.userController.getUsers);
        this.router.get("/users/:id", validateToken, this.userController.getUserById);
    }
}

export default new UserRoutes().router;