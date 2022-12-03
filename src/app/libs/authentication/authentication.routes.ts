import { Router } from 'express';
import { AuthenticationController } from './authentication.controller';

const router = Router();

router.get('/verifyUser', AuthenticationController.verifyUser);
router.post('/createTokens', AuthenticationController.createTokens);

export { router };
