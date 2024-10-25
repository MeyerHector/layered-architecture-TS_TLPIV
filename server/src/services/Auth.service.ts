import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginUser, CreateUser } from "../interfaces/index";
import { AuthRepository } from '../repositories/Auth.repository';
import { User } from "../models";
import { envs } from "../environments/environments";

const { JWT_SECRET_KEY } = envs;

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    public async registerUser(userData: CreateUser): Promise<{ user: User, token: string } | undefined> {
        try {
            const { name, email, password } = userData;

            // Verificar si el email ya existe usando el repositorio
            const exist_email = await this.authRepository.findUserByEmail(email);
            if (exist_email) {
                throw new Error("Email already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.authRepository.createUser(name, email, hashedPassword);

            const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
                expiresIn: '1h'
            }).replace(/\s/g, '');

            return { user, token };
        } catch (error) {
            console.error("Error registering user:", error);
            throw new Error("Registration failed");
        }
    }

    public async loginUser(user: LoginUser): Promise<{ user: User, token: string } | undefined> {
        try {
            // Verificar si el usuario existe mediante el email usando el repositorio
            const exist_user = await this.authRepository.findUserByEmail(user.email);
            if (!exist_user) {
                throw new Error("User not found");
            }

            const validPassword = await bcrypt.compare(user.password, exist_user.password);
            if (!validPassword) {
                throw new Error("Invalid password");
            }

            const token = jwt.sign({ id: exist_user.id }, JWT_SECRET_KEY, {
                expiresIn: '1h'
            });

            return { user: exist_user, token };
        } catch (error) {
            console.error("Error logging in:", error);
            throw new Error("Login failed");
        }
    }
}
