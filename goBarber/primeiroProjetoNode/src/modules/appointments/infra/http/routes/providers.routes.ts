import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvalabilityController from '../controllers/ProviderDayAvalabilityController';
import ProviderMonthAvalabilityController from '../controllers/ProviderMonthAvalabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvalabilityController = new ProviderDayAvalabilityController();
const providerMonthAvalabilityController = new ProviderMonthAvalabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);

providersRouter.get(
	'/:provider_id/month-availability',
	providerMonthAvalabilityController.index,
);

providersRouter.get(
	'/:provider_id/day-availability',
	providerDayAvalabilityController.index,
);

export default providersRouter;
