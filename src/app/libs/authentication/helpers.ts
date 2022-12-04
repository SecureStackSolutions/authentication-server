import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import CryptoJS from 'crypto-js';
import { IncomingHttpHeaders } from 'http';

const { accessTokenSecret, refreshTokenSecret, refreshTokenPayloadSecret } =
    config;

export const generateAccessToken = (params: any) =>
    jwt.sign({ ...params }, accessTokenSecret, { expiresIn: '60s' });

export const generateRefreshToken = (params: RefreshTokenPayload) =>
    jwt.sign(
        {
            encodedPayload: CryptoJS.AES.encrypt(
                JSON.stringify(params),
                refreshTokenPayloadSecret
            ).toString(),
        },
        refreshTokenSecret,
        { expiresIn: '90d' }
    );

const getRefreshTokenFromCookies = (cookies: string | undefined): string => {
    if (!cookies) {
        throw Error('NO COOKIES');
    }

    const cookiesArray = cookies.split(';');
    for (const cookie of cookiesArray) {
        const [key, value] = cookie.trim().split('=');
        if (key === 'THIS_IS_NOT_THE_REFRESH_TOKEN_YOU_ARE_LOOKING_FOR') {
            return value;
        }
    }

    throw Error('COOKIES DO NOT CONTAIN REFRESH TOKEN');
};

export const getTokensFromHeaders = (headers: IncomingHttpHeaders) => ({
    refreshToken: getRefreshTokenFromCookies(headers.cookie),
    accessToken:
        headers.THIS_IS_NOT_THE_ACCESS_TOKEN_YOU_ARE_LOOKING_FOR as string,
});

export interface RefreshTokenPayload {
    email: string;
    userId: string;
    name: string;
    [key: string]: string;
}
