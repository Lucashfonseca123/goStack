import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

// import User from '../infra/typeorm/entities/User';

interface IRequest {
	email: string;
}

@injectable()
class SendForgotPasswordEmailService {
	constructor(
		@inject('UsersRepository')
		private userRepository: IUserRepository,

		@inject('MailProvider')
		private mailProvider: IMailProvider,

		@inject('UserTokensRepository')
		private userTokensRepository: IUserTokensRepository,
	) {}

	public async execute({ email }: IRequest): Promise<void> {
		const checkUserExists = await this.userRepository.findByEmail(email);

		if (!checkUserExists) {
			throw new AppError('User does not exists');
		}

		await this.userTokensRepository.generate(checkUserExists.id);

		this.mailProvider.sendMail(
			email,
			'Pedido de recuperação de senha recebido',
		);
	}
}

export default SendForgotPasswordEmailService;