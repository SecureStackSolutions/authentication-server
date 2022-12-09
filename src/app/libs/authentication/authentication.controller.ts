import { Request, Response } from 'express';
import { verifyUserTokens } from './controls/verifyTokens';
import { generateAccessToken, generateRefreshToken } from './helpers';

interface CustomRequest<T> extends Request {
    body: T;
}

export class AuthenticationController {
    static async verifyUser(req: Request, res: Response) {
        try {
            const { accessToken, refreshToken } = await verifyUserTokens({
                headers: req.headers,
            });

            if (accessToken && refreshToken) {
                res.cookie('refresh-token', refreshToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000 * 60,
                });
                res.setHeader('access-token', accessToken);
            }

            return res.status(200).send({
                type: 'SUCCESS',
                results: [],
            });
        } catch (err: any) {
            console.log(err);
            if (err instanceof Error) {
                return res.status(400).send({
                    type: 'ERROR',
                    message: err.message,
                });
            }

            return res.status(400).send({
                type: 'ERROR',
                message: 'AN UNKNOWN ERROR OCCURED',
            });
        }
    }

    static async createTokens(
        req: CustomRequest<{ name: string; email: string; id: number }>,
        res: Response
    ) {
        try {
            const { name, email, id } = req.body;

            return res.status(200).send({
                type: 'SUCCESS',
                results: [
                    {
                        refreshToken: generateRefreshToken({
                            email,
                            name,
                            userId: id.toString(),
                        }),
                        accessToken: generateAccessToken({
                            email,
                            name,
                        }),
                    },
                ],
            });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).send({
                    type: 'ERROR',
                    message: err.message,
                });
            }

            return res.status(400).send({
                type: 'ERROR',
                message: 'AN UNKNOWN ERROR OCCURED',
            });
        }
    }
}
