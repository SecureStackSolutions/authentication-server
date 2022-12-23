import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import CryptoJS from 'crypto-js';
import { IncomingHttpHeaders } from 'http';

const { authenticationTokenSecret } = config.secrets;

export const generateAuthenticationToken = (params: RefreshTokenPayload) =>
    jwt.sign({ payload: params }, authenticationTokenSecret, {
        expiresIn: '90d',
    });

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

function getAuthenticationToken(headers: IncomingHttpHeaders): string {
    const authenticationToken = headers['authentication-token'];
    if (!authenticationToken) {
        throw Error('Authentication token not found');
    }
    return authenticationToken as string;
}

export const getTokensFromHeaders = (headers: IncomingHttpHeaders) => ({
    authenticationToken: getAuthenticationToken(headers),
});

export interface RefreshTokenPayload {
    email: string;
    userId: string;
    name: string;
    [key: string]: string;
}
