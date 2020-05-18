import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
	name: string;
	email: string;
	password: string;
}

@injectable()
class CreateUserService {
	constructor(
		@inject('UsersRepository')
		private userRepository: IUserRepository,
	) {}

	public async execute({ name, email, password }: IRequest): Promise<User> {
		// Caso não precise de um método especifico (Alem de create, find, delete), importo o getRepository

		const checkUserExists = await this.userRepository.findByEmail(email);

		// Service sempre dispara um erro
		if (checkUserExists) {
			throw new AppError('Email address already used.');
		}

		const hashedPassword = await hash(password, 8);

		const user = await this.userRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		return user;
	}
}

export default CreateUserService;
