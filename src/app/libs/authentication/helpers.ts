import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import CryptoJS from 'crypto-js';
import { IncomingHttpHeaders } from 'http';

const { accessTokenSecret, refreshTokenSecret, refreshTokenPayloadSecret } =
    config.secrets;

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

function getRefreshTokenFromCookies(cookies: string | undefined): string {
    if (!cookies) {
        throw Error('NO COOKIES');
    }
    const cookiesArray = cookies.split(';');
    for (const cookie of cookiesArray) {
        const [key, value] = cookie.trim().split('=');
        if (key === 'refresh-token') {
            return value;
        }
    }

    throw Error('REFRESH TOKEN NOT FOUND');
}

function getAccessTokenFromHeader({
    'access-token': accessToken,
}: {
    'access-token': string;
}): string {
    // if (!accessToken) {
    //     throw Error('ACCESS TOKEN NOT FOUND');
    // }
    return accessToken;
}

export const getTokensFromHeaders = (headers: IncomingHttpHeaders) => ({
    refreshToken: getRefreshTokenFromCookies(headers.cookie),
    accessToken: getAccessTokenFromHeader(headers as any),
});

export interface RefreshTokenPayload {
    email: string;
    userId: string;
    name: string;
    [key: string]: string;
}
