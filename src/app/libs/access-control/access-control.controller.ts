import { Request, Response } from 'express';
import { authenticateUser } from './controls/authenticateUser';

export class AuthenticationController {
    static async authenticate(req: Request, res: Response) {
        try {
            const idToken = req.get('id-token');

            if (!idToken) {
                throw Error('Not a valid token');
            }

            const { name, email } = await authenticateUser(idToken);

            return res.status(200).send(
                createResponse({
                    type: 'Success',
                    extras: {
                        userId: 1,
                        email,
                        name,
                    },
                })
            );
        } catch (err: any) {
            if (err instanceof Error) {
                return res.status(400).send(
                    createResponse({
                        type: 'Error',
                        message: err.message,
                    })
                );
            }

            return res.status(400).send(
                createResponse({
                    type: 'Error',
                    message: 'An unknown error occured',
                })
            );
        }
    }
}

interface createResponseInput {
    type: string;
    message?: string;
    results?: ResultsResponseType[];
    extras?: ResultsResponseType;
}

function createResponse({
    type,
    message = '',
    results = [],
    extras = {},
}: createResponseInput) {
    return { type, message, results, extras };
}

interface ResultsResponseType {
    [key: string]: any;
}
