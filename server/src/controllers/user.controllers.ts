import { Request, Response } from "express";

import { UserService } from '../services/User.service';
 
export class UserController {
    public UserService: UserService;

    constructor() {
        this.UserService = new UserService();

        this.getUsers = this.getUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
    }

    public async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.UserService.getAllUsers();
            console.log("users", users);    
            if (users.length === 0) {
                res.status(400).json({ message: "Error: no hay usuarios" });
            }
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const user = await this.UserService.getUserById(id);
            if (!user) res.status(400).json({ message: "Error al obtener el usuario" });
            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}