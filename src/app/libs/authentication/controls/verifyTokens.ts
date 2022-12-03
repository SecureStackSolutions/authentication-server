import { IncomingHttpHeaders } from 'http';
import {
    generateAccessToken,
    generateRefreshToken,
    getTokensFromHeaders,
} from '../helpers';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { config } from 'src/config';

export async function verifyUserTokens(
    data: saveNewUserType
): Promise<{
    accessToken: string | undefined;
    refreshToken: string | undefined;
}> {
    const { refreshToken, accessToken } = getTokensFromHeaders(data.headers);
    const { accessTokenSecret, refreshTokenSecret, refreshTokenPayloadSecret } =
        config;

    let accessTokenIsExpired = false;
    let accessTokenPayload: any;

    try {
        accessTokenPayload = jwt.verify(accessToken, accessTokenSecret);
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            accessTokenIsExpired = true;
        } else {
            throw Error('UNAUTHORIZED');
        }
    }

    const { encodedPayload } = jwt.verify(
        refreshToken!,
        refreshTokenSecret
    ) as { encodedPayload: string };

    const decryptedPayload = JSON.parse(
        CryptoJS.AES.decrypt(
            encodedPayload,
            refreshTokenPayloadSecret
        ).toString(CryptoJS.enc.Utf8)
    );

    for (const [key, value] of Object.entries(decryptedPayload)) {
        if (accessTokenPayload[key] !== value) {
            throw Error('UNAUTHORIZED');
        }
    }

    let newRefreshToken;
    let newAccessToken;
    if (accessTokenIsExpired) {
        newRefreshToken = generateRefreshToken(decryptedPayload);
        newAccessToken = generateAccessToken(decryptedPayload);
    }
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

type saveNewUserType = { headers: IncomingHttpHeaders };
