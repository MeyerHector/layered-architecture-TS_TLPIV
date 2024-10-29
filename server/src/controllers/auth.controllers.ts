import { Request, Response } from "express";

import { AuthService } from "../services/Auth.service";
import { CreateUser, LoginUser } from "../interfaces";
import { UserService } from "../services/User.service";
import jwt from "jsonwebtoken";

import { envs } from "../environments/environments";
const { JWT_SECRET_KEY } = envs;

export class AuthController {
  public AuthService: AuthService;
  public UserService: UserService;

  constructor() {
    this.AuthService = new AuthService();
    this.UserService = new UserService();

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
  }

  public async register(req: Request, res: Response) {
    const userData: CreateUser = req.body;
    try {
      const data = await this.AuthService.registerUser(userData);
      if (!data)
        return res.status(400).json({ message: "Error al crear el usuario" });
      res.status(201).json({ user: data?.user, token: data?.token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const userData: LoginUser = req.body;
      const data = await this.AuthService.loginUser(userData);
      if (!data)
        return res.status(400).json({ message: "Error al iniciar sesión" });
      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: data?.user,
        token: data?.token,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public async verifyToken(req: Request, res: Response) {
    let token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "No estas autenticado" });
    }
    token = token.split(" ")[1];
    console.log(token);

    jwt.verify(token, JWT_SECRET_KEY, async (err: any, user: any) => {
      if (err) {
        console.log("aca no cumple");
        console.log(err);
        return res.status(401).json({ message: "Token no valido" });
      }

      const userFound = await this.UserService.getUserById(user.id);
      if (!userFound) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.status(200).json({ user: userFound });
    });
  }
}
