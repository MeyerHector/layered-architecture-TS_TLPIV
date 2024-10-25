import { UserRepository } from "../repositories/User.repository";

export class UserService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }
    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }

    async getUserById(id: string) {
        return await this.userRepository.getUserById(id);
    }
}