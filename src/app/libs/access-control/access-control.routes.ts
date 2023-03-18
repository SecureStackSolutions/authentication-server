import { Router } from 'express';
import { AuthenticationController } from './access-control.controller';

const router = Router();

router.get('/authenticate', AuthenticationController.authenticate);

export { router };
