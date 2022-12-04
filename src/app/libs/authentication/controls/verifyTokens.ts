import { IncomingHttpHeaders } from 'http';
import {
    generateAccessToken,
    generateRefreshToken,
    getTokensFromHeaders,
} from '../helpers';
import jwt from 'jsonwebtoken';
import { config } from '../../../../config';

export async function verifyUserTokens(data: saveNewUserType): Promise<{
    accessToken: string | undefined;
    refreshToken: string | undefined;
}> {
    const { refreshToken, accessToken } = getTokensFromHeaders(data.headers);
    const { accessTokenSecret, refreshTokenSecret, refreshTokenPayloadSecret } =
        config.secrets;

    let renewTokens = false;
    let accessTokenPayload: any;

    try {
        accessTokenPayload = jwt.verify(accessToken, accessTokenSecret);
    } catch (err) {
        renewTokens = true;
    }

    const { encodedPayload } = jwt.verify(refreshToken, refreshTokenSecret) as {
        encodedPayload: string;
    };

    const decryptedPayload = JSON.parse(
        CryptoJS.AES.decrypt(
            encodedPayload,
            refreshTokenPayloadSecret
        ).toString(CryptoJS.enc.Utf8)
    );

    for (const [key, value] of Object.entries(decryptedPayload)) {
        if (accessTokenPayload[key] !== value) {
            throw Error('UNAUTHORIZED: TOKENS DO NOT MATCH');
        }
    }

    let newRefreshToken;
    let newAccessToken;
    if (renewTokens) {
        newRefreshToken = generateRefreshToken(decryptedPayload);
        newAccessToken = generateAccessToken(decryptedPayload);
    }

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

type saveNewUserType = { headers: IncomingHttpHeaders };
