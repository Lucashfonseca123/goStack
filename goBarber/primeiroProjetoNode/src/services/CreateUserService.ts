import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

interface Request {
	name: string;
	email: string;
	password: string;
}

class CreateUserService {
	public async execute({ name, email, password }: Request): Promise<User> {
		// Caso não precise de um método especifico (Alem de create, find, delete), importo o getRepository
		const userRepository = getRepository(User);

		const checkUserExists = await userRepository.findOne({
			// É igual a email = email
			where: { email },
		});

		// Service sempre dispara um erro
		if (checkUserExists) {
			throw new Error('Email address already used.');
		}

		const hashedPassword = await hash(password, 8);

		const user = userRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		await userRepository.save(user);

		return user;
	}
}

export default CreateUserService;
