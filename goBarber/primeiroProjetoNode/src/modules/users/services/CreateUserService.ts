import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '../repositories/IUserRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

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

		@inject('HashProvider')
		private hashProvider: IHashProvider,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	public async execute({ name, email, password }: IRequest): Promise<User> {
		// Caso não precise de um método especifico (Alem de create, find, delete), importo o getRepository

		const checkUserExists = await this.userRepository.findByEmail(email);

		// Service sempre dispara um erro
		if (checkUserExists) {
			throw new AppError('Email address already used.');
		}

		const hashedPassword = await this.hashProvider.generatehash(password);

		const user = await this.userRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		await this.cacheProvider.invalidatePrefix('providers-list');

		return user;
	}
}

export default CreateUserService;
