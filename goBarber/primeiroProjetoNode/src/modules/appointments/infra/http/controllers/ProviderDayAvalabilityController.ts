import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvalabilityController {
	public async index(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { provider_id } = request.params;
		const { day, month, year } = request.body;

		const listProviderDayAvailabilityService = container.resolve(
			ListProviderDayAvailabilityService,
		);

		const availability = await listProviderDayAvailabilityService.execute({
			day,
			provider_id,
			month,
			year,
		});

		return response.json(availability);
	}
}
