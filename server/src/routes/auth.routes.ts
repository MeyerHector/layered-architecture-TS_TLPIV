import { Router } from "express";
import { AuthController } from "../controllers/auth.controllers";

class AuthRoutes {
  public router: Router;
  public authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/register", (req, res) => {
      this.authController.register(req, res);
    });
    this.router.post("/login", (req, res) => {
      this.authController.login(req, res);
    });
    this.router.get("/verify", (req, res) => {
      this.authController.verifyToken(req, res);
    });
  }
}

export default new AuthRoutes().router;
