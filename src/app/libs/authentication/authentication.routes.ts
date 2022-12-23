import { Router } from 'express';
import { AuthenticationController } from './authentication.controller';

const router = Router();

router.get('/authenticate', AuthenticationController.authenticate);
router.post('/createToken', AuthenticationController.createTokens);

export { router };
