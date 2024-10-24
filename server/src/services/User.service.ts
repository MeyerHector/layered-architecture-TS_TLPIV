import { User } from "../models";
 
export class UserService {
    async getAllUsers() {
        return await User.findAll();
    }

    async getUserById(id: string) {
        return await User.findByPk(id);
    }
}