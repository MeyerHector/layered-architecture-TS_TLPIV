import { Router, Request, Response } from "express";
import { AuthController } from '../controllers/auth.controllers';

 
class AuthRoutes {
    public router: Router;
    public authController: AuthController;

    constructor() {
        this.authController = new AuthController();
        
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.post("/register", this.authController.register);
        this.router.post("/login", this.authController.login);
        this.router.post("/logout", this.authController.logout);
        this.router.get("/profile", this.authController.profile);
        this.router.get("/verify", this.authController.verifyToken);
    }
}

export default new AuthRoutes().router