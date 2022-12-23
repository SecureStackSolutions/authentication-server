import { Request, Response } from 'express';
import { verifyUserTokens } from './controls/verifyTokens';
import { generateAuthenticationToken } from './helpers';

interface CustomRequest<T> extends Request {
    body: T;
}

export class AuthenticationController {
    static async authenticate(req: Request, res: Response) {
        try {
            console.log(req.headers);
            const authenticationTokenPayload = await verifyUserTokens({
                headers: req.headers,
            });

            return res.status(200).send(
                createResponse({
                    type: 'Sucess',
                    extras: { authenticationTokenPayload },
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

    static async createTokens(
        req: CustomRequest<{ name: string; email: string; id: number }>,
        res: Response
    ) {
        try {
            const { name, email, id } = req.body;

            res.setHeader(
                'authentication-token',
                generateAuthenticationToken({
                    email,
                    name,
                    userId: id.toString(),
                })
            );

            return res.status(200).send(createResponse({ type: 'Success' }));
        } catch (err) {
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
