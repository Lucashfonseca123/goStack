import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeNotificationsRepository = new FakeNotificationsRepository();
		fakeCacheProvider = new FakeCacheProvider();
		createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
			fakeNotificationsRepository,
			fakeCacheProvider,
		);
	});

	it('should be able to create a new appointment', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		const appointment = await createAppointment.execute({
			date: new Date(2020, 4, 10, 13),
			user_id: 'user_id',
			provider_id: 'provider_id',
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('provider_id');
	});

	it('should not be able to create two appointment on the same time', async () => {
		const appointmentDate = new Date(2020, 6, 10, 11);

		await createAppointment.execute({
			date: appointmentDate,
			provider_id: 'provider-id',
			user_id: 'user-id',
		});

		await expect(
			createAppointment.execute({
				date: appointmentDate,
				provider_id: 'provider-id',
				user_id: 'user-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment on a past date', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				user_id: 'user-id',
				date: new Date(2020, 4, 10, 11),
				provider_id: 'provider-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment with same user as provider', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 13),
				user_id: '123123',
				provider_id: '123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment before 8am and after 5pm', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 11, 7),
				user_id: 'user-id',
				provider_id: 'provider-id',
			}),
		).rejects.toBeInstanceOf(AppError);

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 11, 18),
				user_id: 'user-id',
				provider_id: 'provider-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
