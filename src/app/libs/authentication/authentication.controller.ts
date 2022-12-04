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
                res.cookie(
                    'THIS_IS_NOT_THE_REFRESH_TOKEN_YOU_ARE_LOOKING_FOR',
                    refreshToken,
                    {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true,
                        maxAge: 24 * 60 * 60 * 1000 * 60,
                    }
                );
                res.setHeader(
                    'THIS_IS_NOT_THE_ACCESS_TOKEN_YOU_ARE_LOOKING_FOR',
                    accessToken
                );
            }

            return res.status(200).send({
                type: 'SUCCESS',
                results: [],
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

    static async createTokens(
        req: CustomRequest<{ name: string; email: string; id: number }>,
        res: Response
    ) {
        try {
            const { name, email, id } = req.body;
            // const userTokens = await getUserTokens({ userId: id });

            await res.cookie(
                'THIS_IS_NOT_THE_REFRESH_TOKEN_YOU_ARE_LOOKING_FOR',
                generateRefreshToken({
                    email,
                    name,
                    userId: id.toString(),
                }),
                {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000 * 90,
                }
            );

            await res.cookie('YOU_CAN_GO_ABOUT_YOUR_BUSINESS', 'MOVE_ALONG', {
                sameSite: 'none',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000 * 90,
            });

            await res.setHeader(
                'THIS_IS_NOT_THE_ACCESS_TOKEN_YOU_ARE_LOOKING_FOR',
                generateAccessToken({
                    email,
                    name,
                })
            );

            return res.status(200).send({
                type: 'SUCCESS',
                results: [],
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
