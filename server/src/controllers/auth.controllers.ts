import { Request, Response } from "express";

import { AuthService } from '../services/Auth.service';
import { CreateUser, LoginUser } from "../interfaces";
import { UserService } from "../services/User.service";
import jwt from 'jsonwebtoken';

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
        this.logout = this.logout.bind(this);
        this.profile = this.profile.bind(this);
        this.verifyToken = this.verifyToken.bind(this);
    }

    public async register(req: Request, res: Response) {
        const userData: CreateUser = req.body;
        try {
            const user = await this.AuthService.registerUser(userData);
            if (!user) res.status(400).json({ message: "Error al crear el usuario" });
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const userData: LoginUser = req.body;
            const loginUser = await this.AuthService.loginUser(userData);
            res.status(200).json({ message: "Inicio de sesión exitoso", user: loginUser });
            if (!loginUser) res.status(400).json({ message: "Error al iniciar sesión" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    public async logout(req: Request, res: Response) {
        res.cookie("token", "", { expires: new Date(0) });
        res.status(200).json({ message: "Sesión cerrada" });
    }

    public async profile(req: Request, res: Response): Promise<void> {
        const userFound = await this.UserService.getUserById(req.user.id);

        if (userFound) {
            res.status(200).json({
                id: userFound.id,
                name: userFound.name,
                email: userFound.email,
                createdAt: userFound.createdAt,
                updatedAt: userFound.updatedAt
            });
        } 
        
        res.status(404).json({ message: "Usuario no encontrado" });
        
    }

    public async verifyToken(req: Request, res: Response) {
        const {token} = req.cookies;
        if (!token) {
            res.status(401).json({ message: "No estas autenticado" });
        }

        jwt.verify(token, JWT_SECRET_KEY, async (err: any, user: any) => {
            if(err) {
                res.status(401).json({ message: "Token no valido" });
            }

            const userFound = await this.UserService.getUserById(user.id);
            if (userFound) {
                res.status(200).json({
                    id: userFound.id,
                    name: userFound.name,
                    email: userFound.email,
                    createdAt: userFound.createdAt,
                    updatedAt: userFound.updatedAt
                });
            }
        })
        
        res.status(404).json({ message: "Usuario no encontrado" }); 

    }
}