import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

import rootRouter from './app/app.routes';
import { config } from './config';

initializeApp({
    credential: credential.cert(config.admin.serviceAccountCert),
});

const app = express();

// Middelware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use('/', rootRouter);

// reduce fingerprinting
app.disable('x-powered-by');

const start = async (): Promise<void> => {
    try {
        app.listen(process.env.PORT);
    } catch (error) {
        process.exit(1);
    }
};

void start();
