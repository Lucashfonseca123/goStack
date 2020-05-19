import { uuid } from 'uuidv4';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
	private appointments: Appointment[] = [];

	public async findByDate(date: Date): Promise<Appointment | undefined> {
		const findAppointments = this.appointments.find(
			appointment => appointment.date === date,
		);

		return findAppointments;
	}

	public async create({
		provider_id,
		date,
	}: ICreateAppointmentsDTO): Promise<Appointment> {
		const appointment = new Appointment();

		Object.assign(appointment, { id: uuid(), date, provider_id });

		this.appointments.push(appointment);

		return appointment;
	}
}

export default AppointmentsRepository;
