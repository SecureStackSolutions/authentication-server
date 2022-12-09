import { IncomingHttpHeaders } from 'http';
import {
    generateAccessToken,
    generateRefreshToken,
    getTokensFromHeaders,
} from '../helpers';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { config } from '../../../../config';
import CryptoJS from 'crypto-js';
import { access } from 'fs';

export async function verifyUserTokens(data: saveNewUserType): Promise<{
    accessToken: string | undefined;
    refreshToken: string | undefined;
}> {
    const { refreshToken, accessToken } = getTokensFromHeaders(data.headers);
    const { accessTokenSecret, refreshTokenSecret, refreshTokenPayloadSecret } =
        config.secrets;

    let renewTokens = false;
    let accessTokenPayload: any;

    // accessTokenPayload = jwt.verify(
    //     accessToken,
    //     accessTokenSecret,
    //     (err, decoded) => {
    //         console.log(decoded);
    //     }
    // );

    // try {
    // } catch (err) {
    //     if (err instanceof TokenExpiredError) {
    //         renewTokens = true;
    //     } else {
    //         throw Error('UNAUTHORIZED: NOT A VALID ACCESS TOKEN');
    //     }
    // }

    const { encodedPayload } = jwt.verify(refreshToken, refreshTokenSecret) as {
        encodedPayload: string;
    };

    const { email, name, userId } = JSON.parse(
        CryptoJS.AES.decrypt(
            encodedPayload,
            refreshTokenPayloadSecret
        ).toString(CryptoJS.enc.Utf8)
    );

    // if (
    //     accessTokenPayload.email !== email ||
    //     accessTokenPayload.name !== name
    // ) {
    //     throw Error('UNAUTHORIZED: TOKENS DO NOT MATCH');
    // }

    let newRefreshToken;
    let newAccessToken;
    if (renewTokens) {
        newRefreshToken = generateRefreshToken({ email, name, userId });
        newAccessToken = generateAccessToken({ email, name });
    }

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

type saveNewUserType = { headers: IncomingHttpHeaders };
