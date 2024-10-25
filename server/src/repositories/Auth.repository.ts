import { User } from '../models';

export class AuthRepository {
    public async findUserByEmail(email: string): Promise<User | null> {
        return await User.findOne({ where: { email } });
    }

    public async createUser(name: string, email: string, password: string): Promise<User> {
        return await User.create({ name, email, password });
    }
}
